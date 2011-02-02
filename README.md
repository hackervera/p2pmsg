FIRST THING!  
**git submodule init**  
**git submodule update**

This will pull all the required deps in automagically  
My code is alpha so use at your own risk.  

Also, you need to build sqlite binding:  
**cd node-sqlite**  
**./build.sh**

To run the webserver:  
**node server.js**  
connect to http://localhost:8080/tweets

Example server is running (maybe be up or down depending...)  
<http://www.nostat.us:8080/tweets>

If you enter a message in the box and press 'send', it will send your message to every other server on the entire network.

To send a message to all webservers from command line:  
**node client.js "Some interesting message"**  

The messages from client.js will propagate to every webserver in the network.  
It's routed using the Telehash distributed p2p network <http://www.telehash.org>

I also included a php client:  
**php client.php "Some interesting message"**  

Released under MIT  
Copyright Tyler Gillies 2011  
