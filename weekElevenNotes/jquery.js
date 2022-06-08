let p = $('#test'); /* jquery element object that is 
returned from the jquery call*/
let div = $('.my-class');
let ul = $('ul');

console.log(p);
console.log(div);
console.log(ul);

console.log(p.text()); /*text is a method on the object */ 
p.text('New Text') /*if you don't put in arguments it returns 
text; if you pass in a string argument it sets the text*/

/*$('input').val('New Value'); /*reference to above input */ 

$('input').attr('placeholder', 'Placeholder Text');
/*allows us to change an attribute */

/*to add an element to a DOM use append, prepend, before, 
after; append and prepend add content to an existing 
element either at end of element's current content or at 
the beginning; after and before allow us to add content 
immediately after or before an existing element*/

div.prepend('<p>prepended paragraph</p>');
div.append('<p>appended paragraph</p>');
div.before('<p>paragraph added before the div</p>');
div.after('<p>paragraph added after the div</p>');

/*to remove elements we can use remove and empty; remove
deletes the element and all its children from the DOM; 
empty removes all the children of the selected element 
from the DOM*/

div.empty(); 
ul.remove(); /*div exists, but paragraphs inside were 
removed, and the unordered list doesn't exist anymore; empty
removed everything from the div, and remove actually
removed the entire unordered list element*/

/*sometime we want to hide an element from being 
displayed, but not removed all together; use the 
hide and show methods. */

$('input').hide();
setTimeout(() => $('input').show(), 2000); /*2000 refers
to milliseconds */



