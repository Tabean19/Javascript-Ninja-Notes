//Chapter 6: Functions for the future; generators and promises.
//This chapter explores two new additions as of ES6 -- Generator functions and promises.
//Generators are a special type of function. Normal functions can return at most 1 value while it is ran, generators can return multiple and are able to 
//suspend their execution between requests.
//Promises are a new built-in type of object that acts as a placeholder for a value that we do not have yet but will at some later point.

//imagine we need to write code that will allow users access to data stored on a remote server in JSON format, you could write something like this:
try {
    var cars = syncGetJSON(cars.json); 
    var trim = syncGetJSON(cars[0].trimDetails);    
    var price = syncGetJSON(trim[0].priceDetails);
}
catch(e) {
    //oh no! we werent able to get the car price!
}
//this code is easy to understand, but will cause the end user to wait for the request to resolve before being able to do anything else on the page due to the single
//threaded nature of Javascript.
//we can re-write the code using callbacks that will be invoked whenever the request finishes like this: 
getJSON("cars.json", function(err, cars){
    if (err) {
        console.log("error fetching list of cars", err);
        return;
    }
    getJSON(cars[0].trimDetails, function(err, trim){
        if (err){
            console.log("error fetching list of trim options");
            return;
        }
        getJSON(trim[0].priceDetails, function(err, price){
            if (err) {
                console.log("error fetching price details");
                return;
            }
        });
    });
});
//this code will not block the user during its execution, but its ugly. By using Generators and promises we can clean it up tremendously:
async(function*(){  //using a new generator function
    try{
        const cars = yield getJSON("cars.json");
        const trim = yield getJSON(cars[0].trimDetails);    //with promises
        const price = yield getJSON(trim[0].priceDetails);

    }
    catch(e) {
        //oh no we werent able to get the car price!
    }
});

//working with generators
//a generator is a function that produces a sequence of values on a per request basis. and suspends its execution between requests. 
function* numberGenerator(){    //the asterisk appended to the end of the function indicates it will be a generator function
    yield 1;    //the yield keyword characteristic of a generator.
    yield 2;
    yield 3;
    yield 4;
}
for (let number of numberGenerator()){  //using a new "for-of" loop to run the function gives us a clean 1,2,3,4 output. 
    console.log(number);
}

//controlling the generator through an 'iterator' object.
//when a generator is called it does not execute the body of the function but instead creates a new object reference to the generator. 
function* numberGenerator(){
    yield 1;
    yield 2;
}

const numberIterator = numberGenerator();
result1 = numberIterator.next();    //1
result2 = numberIterator.next();    //2
result3 = numberIterator.next();    //undefined
//when the Iterator is called it executes the body of the generator until the yield keyword is reached. it creates a new object with that result and whether the
//generator is done or not. The generator suspends itself and waits for another value request -- this keeps it from blocking the call stack
//the third call of the generator returns a value of undefined and done = true; signaling that it has executed all available code. 

function* numberGenerator(){
    yield 1;
    yield 2;
}

const numberIterator = numberGenerator();
let number;
while(!(number = numberIterator.next()).done) { 
    console.log(number);        //{value: 1, done: false}
                                //{value: 2, done: false}
}

//the new for-of loop is syntactic sugar for iterating over iterators. Instead of calling the interator method .next and constantly checking if we're .done, 
//for-of does all this automatically behind the scenes. 

for(let number of numberGenerator()){
    console.log(number);    //1
                            //2
}

//just like we often call standard functions within other functions, we can do the same with generators. 
function* letterGenerator(){
    yield "A";
    yield* numberGenerator();   //this yield refers to another generator function, note the * on the end. 
    yield "B";
}

function* numberGenerator(){
    yield 1;
    yield 2;
}

for(letter of letterGenerator() ){
    console.log(letter);                // "A", 1, 2, "B"
}
//when using the yield* operator on iterator (for-of), we yield all executing to a new generator -- numberGenerator -- until it has completed and then we resume
//execution of letterGenerator. 

//using generators to generate unique IDs
//commonly we need to assign IDs to objects, the easiest way is through a global counter variable but this is ugly and accident prone.
function* IdGen(){
    let id = 0;
    while(true){    //using an infinite loop is okay in generators because the execution is suspended until the .next
        yield ++id;
    }
}

const IdIterator = IdGen();
const person1 = {id: IdIterator.next().value};
const person2 = {id: IdIterator.next().value};
const person3 = {id: IdIterator.next().value};
const person4 = {id: IdIterator.next().value};
const person5 = {id: IdIterator.next().value};


