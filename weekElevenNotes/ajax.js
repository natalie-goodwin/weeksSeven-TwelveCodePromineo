$.get('https://reqres.in/api/users/2', (data) => console.log(data));
/* sending HTTP get request to the URL; it responds to data 
and we log out the data*/

$.post('https://reqres.in/api/users/2', {
    name: 'Tommy',
    job: 'Front End Software Developer'
}, (data) => console.log(data));