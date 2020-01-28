# Code style guide
- Function names, variables are lowerCamelCase
- Global variables are UpperCamelCase
- Tabs not spaces
- No spaces between brackets
- Use these
```js
if (condition) {
	// do something
} else {
	// do something else
}

func((arg1, arg2) => {
	// callback stuff
})
```
- Not these
```js
if (condition)
{
	// do somnething
}
else
{
	// do something else
}

if (conditon) {
	// do something else
}
else {
	// do something else
}

func(function(arg1, arg2){
	// do something
});
```

Use JSDoc for comments:

```
/**
* Here you put a description of what the function does
* @param {string} var1 Whatever var1 is used for
* @param {number} var2 Whatever var2 is used for
 */
function myFunc(var1, var2){
	return "this";
}
