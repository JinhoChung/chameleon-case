Object key Changer that you can pick some classes which should be ignored from key changing.
For example, you can customize it for ignoring 'Date' and 'ObjectID' for mongoose object    

### Usage

```javascript
var cc = require('chameleon-case');
cc.camelcase({ hello_world: { hello_world: [ { hello_world: 1 } ] } });
// {helloWorld: {helloWorld: [{helloWorld: 1}]}} 

cc.snakecase({ helloWorld: { helloWorld: [ { helloWorld: 1 } ] } } );
// {hello_world: {hello_world: [{hello_world: 1}]}} 


/* with Mongoose */
cc.option({
    ignoreClass: ['Date', 'ObjectID'] // Date is for some timestamps. ObjectID is for sub document id
  })
MyObject.findOne().lean().then(doc => cc.camelcase(doc)) // Note that you should call lean for avoiding infinite loop

```