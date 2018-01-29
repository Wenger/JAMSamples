jdata {
    int y as broadcaster;
    
    struct basket{
    	int apple;
    	float pear;
    } myBasket as broadcaster;

    struct bag{
    	int pen;
    	float water;
    	int book;
    } myBag as broadcaster;
}

var i=0;

setInterval(function() {
    if(i==10) return;
    y.broadcast(Math.floor((Math.random() * 100) + 1));
    
    myBasket.broadcast({
    	apple: Math.floor(Math.random() * 100),
    	pear : Math.random() * 1000
    });
    
    myBag.broadcast({
        pen: Math.floor(Math.random() * 10),
        water: Math.random() * 100,
    	book: Math.random() * 100
    });

    i++;
}, 1000);
