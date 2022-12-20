const express = require("express");
// require("./db/config");
const PORT = process.env.PORT || 3001;

const app = express();
// const User = require("./db/User");
const mongodb = require('mongodb');

const url = "mongodb://localhost:27017/stock-market-db";

app.use(express.json());

const userAlph = ["A", "B", "C", "D", "E"];

app.post('/api/portfolio', async (req, res) => {
    const { user } = req.body;

    try{
        const client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db();
        const collection = db.collection('users');

        const item = await collection.findOne({ user: user });
    
        res.send(item);
    } catch (error) {
        res.status(500).send('Error connecting to the database');
      }    
    
});

app.post('/api/orderbook', async (req, res) => {
    try{
        const client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db();
        const collection = db.collection('orders');

        const buyOrders = await collection.findOne({ type:"Buy" });
        const sellOrders = await collection.findOne({ type:"Sell" });
        let obj={
            buyOrders: buyOrders.pending,
            sellOrders: sellOrders.pending
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send('Error connecting to the database');
      }    
});

app.post('/api/history', async (req, res) => {
    try{
        const client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db();
        const collection = db.collection('orders');

        const transactions = await collection.findOne({ type:"transactions" });

        res.send(transactions.history);
    } catch (error) {
        res.status(500).send('Error connecting to the database');
      }    
});

app.post('/api/portfolio/update', async (req, res) => {
    const value = req.body.amount;
    const user = req.body.user;
    const stockvalue = req.body.stocks;
    try{
        const client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db();
        const collection = db.collection('users');

        collection.updateOne( { user: user },
            { $set: { assets: value, stocks: stockvalue } }, (err, result) => {
            if (err) {
              console.error(err);
              res.sendStatus(500);
              return;
            }
            console.log("DB Updated");
            res.sendStatus(200);
        });
    } catch (error) {
        res.status(500).send('Error connecting to the database');
      }    
    
});

app.post('/api/place', async (req, res) => {
    const user = req.body.user;
    const buysell = req.body.buysell;
    const orderType = req.body.orderType;
    const amount = Number(req.body.amount);
    const price = Number(req.body.price);


    try{
        const client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db();
        const userCollection = db.collection('users');
        const orderCollection = db.collection('orders');

        const market = await orderCollection.findOne({ type: "Price"});
        const marketPrice = market.marketPrice;

        const item = await userCollection.findOne({ user: user});
        const balance = Number(item.assets);
        const stockBalance = Number(item.stocks);


        if(orderType==="Limit"){
            if(buysell==="Buy"){
                if(balance<amount*price){
                    res.send("Low Balance");
                    return;
                }

                const limitItem = await orderCollection.findOne({ type: "Buy"});

                const buyOrders = limitItem.pending;
                let obj = {
                    user: user,
                    price: Number(price),
                    quantity: Number(amount)
                }
                
                userCollection.updateOne( { user: user },{ $set: { assets: balance - amount*price } });  
                buyOrders.push(obj);
                buyOrders.sort((a,b) => a.price - b.price);
                orderCollection.updateOne( { type: "Buy" },{ $set: { pending: buyOrders}});
                res.send("Success! Buy Order Placed");
                return;
            }
            else{
                if(stockBalance<amount){
                    res.send("Not enough quantity of stocks available.");
                    return;
                }

                const limitItem = await orderCollection.findOne({ type: "Sell"});

                const sellOrders = limitItem.pending;
                let obj = {
                    user: user,
                    price: price,
                    quantity: amount
                }
                
                userCollection.updateOne( { user: user },{ $set: { stocks: stockBalance - amount } });  
                sellOrders.push(obj);
                sellOrders.sort((a,b) => b.price - a.price);
                orderCollection.updateOne( { type: "Sell" },{ $set: { pending: sellOrders}});
                res.send("Success! Sell Order Placed");
                return;
            }
        }
        else{
            if(buysell === "Buy"){
                const limitItem = await orderCollection.findOne({ type: "Sell"});
                let sellOrders = limitItem.pending;
                let numOfOrders = sellOrders.length;
                if(numOfOrders === 0){
                    res.send("No limit orders available to buy from.");
                    return;
                }
                let currentQuantity = amount, currentBalance = balance, i = numOfOrders;
                while(i>=0){
                    const bestBuy = sellOrders[i-1];
                    if(currentQuantity<=bestBuy.quantity){
                        currentBalance -= (bestBuy.price*currentQuantity);
                        currentQuantity = 0;
                        break;
                    }
                    currentQuantity-=bestBuy.quantity;
                    currentBalance-=(bestBuy.quantity*bestBuy.price);
                    i--;
                }
                if(currentQuantity>0){
                    res.send("Not enough sellers to buy from.");
                    return;
                }
                if(currentBalance<0){
                    res.send("Not enough balance to buy this quantity at market price.");
                    return;
                }
                currentQuantity = amount; 
                currentBalance = balance; 
                buyPrice=0;
                const transactions = await orderCollection.findOne({ type: "transactions"});
                let history = transactions.history;
                while(currentQuantity != 0){
                    const bestBuy = sellOrders[sellOrders.length-1];
                    const currBal = await userCollection.findOne({ user: bestBuy.user});
                    if(currentQuantity<=bestBuy.quantity){
                        userCollection.updateOne({user: bestBuy.user },{ $set: { assets: Number(currBal.assets) + Number(currentQuantity*bestBuy.price)}});
                        currentBalance -= (bestBuy.price*currentQuantity);
                        sellOrders[sellOrders.length-1].quantity -= currentQuantity;
                        if(sellOrders[sellOrders.length-1].quantity === 0){
                            sellOrders.pop();
                        }
                        let obj ={
                            buyer: "User "+ userAlph[user-1],
                            seller: "User "+ userAlph[bestBuy.user-1],
                            price: Number(bestBuy.price),
                            quantity: Number(currentQuantity)
                        }
                        history.unshift(obj);
                        if(history.length>10){
                            history.pop();
                        }
                        currentQuantity = 0;
                        break;
                    }
                    let obj ={
                        buyer: "User "+ userAlph[user-1],
                        seller: "User "+ userAlph[bestBuy.user-1],
                        price: Number(bestBuy.price),
                        quantity: Number(bestBuy.quantity)
                    }
                    history.unshift(obj);
                    if(history.length>10){
                        history.pop();
                    }
                    userCollection.updateOne( { user: bestBuy.user },{ $set: { assets: Number(currBal.assets) + Number(bestBuy.quantity*bestBuy.price) } }); 
                    currentQuantity-=bestBuy.quantity;
                    currentBalance-=(bestBuy.quantity*bestBuy.price);
                    sellOrders.pop();
                }
                userCollection.updateOne( { user: user },{ $set: {assets: currentBalance, stocks: stockBalance + amount }}); 
                orderCollection.updateOne( { type: "Sell" },{ $set: { pending: sellOrders}});
                orderCollection.updateOne({type: "transactions"}, { $set: { history: history}});
                res.send("Success! Stocks bought at Market Price");
                return;
            }
            else{
                const limitItem = await orderCollection.findOne({ type: "Buy"});
                let buyOrders = limitItem.pending;
                let numOfOrders = buyOrders.length;
                if(numOfOrders === 0){
                    res.send("No limit orders available to sell to.");
                    return;
                }
                let currentQuantity = amount, i = numOfOrders;
                while(i>=0){
                    const bestBuy = buyOrders[i-1];
                    if(currentQuantity<=0){
                        break;
                    }
                    currentQuantity-=bestBuy.quantity;
                    i--;
                }
                if(currentQuantity>0){
                    res.send("Not enough buyers to sell to.");
                    return;
                }
                currentQuantity = amount; 
                currentBalance = balance; 
                buyPrice=0;
                while(currentQuantity != 0){
                    const bestBuy = buyOrders[buyOrders.length-1];
                    const currBal = await userCollection.findOne({ user: bestBuy.user});
                    if(currentQuantity<=bestBuy.quantity){
                        userCollection.updateOne( { user: bestBuy.user },{ $set: { stocks: Number(currBal.stocks) + Number(currentQuantity) } }); 
                        currentBalance += (bestBuy.price*currentQuantity);
                        buyOrders[buyOrders.length-1].quantity -= currentQuantity;
                        if(buyOrders[buyOrders.length-1].quantity === 0){
                            buyOrders.pop();
                        }
                        currentQuantity = 0;
                        break;
                    }
                    
                    userCollection.updateOne( { user: bestBuy.user },{ $set: { stocks: Number(currBal.stocks) + Number(bestBuy.quantity) } }); 
                    currentQuantity-=bestBuy.quantity;
                    currentBalance+=(bestBuy.quantity*bestBuy.price);
                    buyOrders.pop();
                }

                userCollection.updateOne( { user: user },{ $set: {assets: currentBalance, stocks: stockBalance - amount }}); 
                orderCollection.updateOne( { type: "Buy" },{ $set: { pending: buyOrders}});
                res.send("Success! Stocks sold at Market Price");
                return;
            }
        }
    } catch (error) {
        res.status(500).send('Error connecting to the database');
      }    
    
});
  
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });