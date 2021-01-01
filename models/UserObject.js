

class Userpro {                                                       //Object model for userprofile

    constructor(userId, userConnections) {
        this._userId = userId;
        this._userConnections = userConnections;
    };

    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }

    get userConnections() {
        return this._userConnections;
    }
    set userConnections(value) {
        this._userConnections = value;
    }
    addconnection(userConnection) {
        var connections = this.userConnections;
        var count = 0, n = connections.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                if (connections[i].event != userConnection.event) {
                    count++;
                    if (count == n) {
                        connections.push(userConnection);
                    }
                }
            }
        }
        else {
            connections.push(userConnection);
        }
        this.userConnections = connections;
    }




    updateconnection(Uid, rsvp) {
        var connections = this.userConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].Uid == Uid) {
                connections[i].rsvp = rsvp;
            }
        }
        this.userConnections = connections;
    }




    removeconnection(Uid) {
        var connections = this.userConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].Uid == Uid) {
                connections.splice(i, 1);
            }
        }
        this.userConnections = connections;
    }
  }
  class Userconn {
                                                                            //loading constructor
                                                                            // UserConnection class.
      constructor(Uid, event, category, rsvp) {
          this._Uid = Uid;
          this._event = event;
          this._category = category;
          this._rsvp = rsvp;
      }

      get Uid() {
          return this._Uid;
      }

      set Uid(value) {
          this._Uid = value;
      }

      get event() {
          return this._event;
      }

      set event(value) {
          this._event = value;
      }

      get category(){
          return this._category;
      }

      set category(value){
          this._category = value;
      }

      get rsvp() {
          return this._rsvp;
      }

      set rsvp(value) {
          this._rsvp = value;
      }
  }

  module.exports ={
    Userpro : Userpro,
    Userconn : Userconn

  } ;
