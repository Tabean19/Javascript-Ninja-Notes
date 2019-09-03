//Chapter 3
//Javascript is a 'functional' language
//functions are first class objects meaning thhey can be:
//created via literals
function thisIsALiteralFunction (){}
//Assigned to variables, arrays or properties of objects.
var randomVariable = function () {}; //variable
randomArray.push(function (){}); //array entry
randomObject.data = function (){}; //object property
//passed as arguments to other functions
function (innerFunction){
    innerFunction();
};
//returned as values from a function
function returnFunction(){
    return randomFunction(){};
};
//they possess properties that can be dynamically created and assigned.
var randomFunctiion = function (){};
randomFunction.randomProperty = "Whatever";

//whenever we pass a function as an argument for another function we are using a 'callback' function.
//callback functions are functions that are set up to be called later on by the browser or another piece of code.
function thisIsNotACallback(thisIsACallback){
    return thisIsACallback();
};
//thisIsNotACallBack is a meaningless parameter, lets define the callback function to use as an argment. 
function defineCallback(){
    //do stuff here
};

thisIsNotACallback(defineCallback);
//you can also pass the function expression, body and all, into the arguments of the thisIsNotACallBack function. 
thisIsNotACallback(defineCallback(){
    //do stuff here
});

//storing multiple unique functions in a collection using a cache:
var store = {   //creates an object called 'store' where we store the unique functions
    nextId: 1, //a numerical Id # given to each subsequent function
    cache: {},  //an empty object within 'store' called 'cache'.
    add: function(fn) { //the 'add' property is a function that adds new functions to the cache
        if (!fn.id) {   //we first check to see is a new function has an 'id' property, is not (!) then we proceed. 
            fn.id = this.nextId++; //we add the # from the 'nextId' property to the function and then increase the # by one.
            this.cache[fn.id] = fn; //finally, we add the functions (fn) to the cache using the 'id' property as a key.
            return true;
        }
    }
};

//when performing complex and repetitive calculations, it is more efficient to use a buit in answer cache that will return
//a value that has already been calculated instead of running the function all over again. This is called 'memoization'.
function isPrime(value) {
    if (!isPrime.answers){  //first we check whether the 'answers' property exists.
        isPrime.answers = {};  //if it does not, then we create one as an empty object
    }
    if (isPrime.answers(value) !== undefined){    //then we check the 'value' passed in, whether it is already cached or not.
        return isPrime.answers[value]; //if it is, then the answer that corresponds to that value is given.
    }
    var prime = value !== 1;    //this makes sure that 1 is not a prime number.
    for (var i = 2; i<value; i++) {
        if (value % i === 0){   //if no cached value exists, we run the calulations to determine if the # is prime.
            prime = false;  //if the number passes the 'if' statement algorithm, it is returned as 'false'
            break;
        }
    }
    return isPrime.answers[value] = prime;
}

//there are many different kinds of functions, all with specific uses and are defined in different ways. 
//function declaration
function Declaration(){};
//function expression
var Expression = function(){};
//anonymous function or 'arrow function'. Syntactic sugar for function expressions. 
() => {};
//Constructors
var Constructors = new Function(){};
//Generators
function* Generator(){};

//Immediately Invoked Function Expression -- or IIFE (iffy) for short. Are functions that are called right away.
(function(){});
//or
!function(){}();

//arguments and parameters
//when constructing a functions, you define parameters.
function random(param1, param2){
    param1 + param2;
}
//when calling a function, you define 'arguments' AS your parameters.
random(2, 2);
//in this case, 2 and 2 are arguments1 and arguments2
//if the number of possible arguments is unknown or too large you can define a function with 'rest parameters'
function random(param1, ...remainingArgs){};
//if you would like to set a default value for a parameter that is missing an argument you can use 'default parameters'
function random(param1, param2 = 'default value'){};
