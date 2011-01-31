FIRST THING!  
git submodule init  
git submodule update

Also, you need to build sqlite binding:  
cd node-sqlite  
./build.sh

To run the webserver/display client:  
node message.js  
connect to http://localhost:8080/tweets

Example server is running (maybe be up or down depending...)  
http://www.nostat.us:8080/tweets

To send a message to all web display clients:  
node send.js "Some interesting message"  

The messages from send.js will propagate to every webclient in the network.  
It's routed using the Telehash distributed p2p network http://www.telehash.org

This will pull all the required deps in automagically  
My code is alpha so use at your own risk.  

Released under MIT  
Copyright Tyler Gillies 2011  
