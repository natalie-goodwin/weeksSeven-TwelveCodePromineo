/* Add the code that explains what we want it to do.*/
/* Creating classes for house, rooms, house service 
(which will enable us to send http AJAX request to 
the pre-exisitng API; Also create a class to help 
manage the DOM; we will clear out the part of the DOM 
where we put all the houses in and repopulate the houses)*/ 

class House {
    constructor(name) {
        this.name = name;
        this.rooms = []; /*array to hold all the rooms in the house */
    }

    addRoom(name, area) {
        this.rooms.push(new Room(name, area)); /*this allows us to add rooms 
        to the above array*/
    }

}

class Room {
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }
}

class HouseService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses'; 
    /*root url for all the endpoints we are going to call the api */

    /*methods for class */

    static getAllHouses() {
        return $.get(this.url);
    }

    static getHouse(id) {
        return $.get(this.url + `/${id}`); /*method to get a specific house 
        from the API */
    }
    
    static createHouse(house) { /*this takes an instance 
    of the house class and an array */
        return $.post(this.url, house) /* the reason for all the returns is
        because we will reuse these methods and handle the promise that comes 
        back; that makes the house service reusable so if we want to use it in 
        a larger application, we could reuse the house service anywhere we need 
        to access the calls to the house's api*/
    }

    static updateHouse(house) { /*takes the updated house */ 
        return $.ajax({
            url: this.url + `/${house._id}`, /*updating a house and grabbing id 
            from 
            that house to tell the api which house we want to update in the 
            database; underscore id because it's the value the 
            database will automatically create for the house; using a mongo 
            database*/            
            dataType:'json',
            data: JSON.stringify(house), /* setting the payload here; take 
            an object and convert it to a json string before sending it to the 
            HttP request and the object we want to convert is the house that 
            is passed in as a parameter */
            contentType: 'application/json',
            type: 'PUT' /*this is the type of HTTP verb: PUT request */
        });
    }
    static deleteHouse(id) { /* we only need the house id to tell the api
        this is the house we want to delete; if the house matches the id, 
        delete it*/
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

/* We will use the above house service inside the DOM manager
 below*/
/*We are re-rendering the DOM each time we create a new 
class */

class DOMManager {
    static houses; /*represents all houses in the class*/

    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses));
    }

    static createHouse(name) {
        HouseService.createHouse(new House(name))
        .then(() => { /*new instance of house */
            return HouseService.getAllHouses();
        })
        .then((houses) => this.render(houses));
    }
 
    static deleteHouse(id) {
        HouseService.deleteHouse(id)
        .then(() => { /*delete a house */
            return HouseService.getAllHouses();
        }) /*send HTTP request to get all existing houses */
        .then((houses) => this.render(houses));
    } /* re-render house DOM*/


    static addRoom(id) {
        for (let house of this.houses) {
            if (house._id == id) {
                house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()));
                HouseService.updateHouse(house)
                    .then(() => {
                        return HouseService.getAllHouses();
                    })
                   .then((houses) => this.render(houses));                    
                }
            }
        }

    static deleteRoom(houseId, roomId) {
        for (let house of this.houses) {
             if (house._id == houseId) {
                    for (let room of house.rooms) {
                        if (room._id == roomId) {
                            house.rooms.splice(house.rooms.indexOf(room), 1);
                            HouseService.updateHouse(house)
                            .then(() => {
                                return HouseService.getAllHouses();
                            })
                            .then((houses) => this.render(houses));
                        }
                    }             
                }
            }
        }    

    static render(houses) {
        this.houses = houses;
        $('#app').empty(); /* clears everytime we re-render the 
        DOM */
        for(let house of houses) {
            $('#app').prepend(
                `<div id="${house._id}" class="card">
                   <div class="card-header">
                     <h2>${house.name}</h2> 
                     <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button> 
                    </div> 
                    
                    <div class="card-body">
                        <div class="card">
                           <div class="row">
                             <div class="col-sm">
                                <input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
                        </div>                    
                        <div class="col-sm">
                        <input type="text" id="${house._id}-room-area" class="form-control" placeholder="Room Area">
                        </div>                    
                    </div>  
                    
                    <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>                 
                    
                    </div>            
                    </div> 
                </div> <br>` 
            );
            for (let room of house.rooms) {
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${room._id}"><strong>Name:</strong> ${room.name}</span>
                    <span id="area-${room._id}"><strong>Area:</strong> ${room.area}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`
                );
            }
        }
    }
}

$('#create-new-house').click(() => {
    DOMManager.createHouse($('#new-house-name').val());
    $('#new-house-name').val('');
});

DOMManager.getAllHouses();