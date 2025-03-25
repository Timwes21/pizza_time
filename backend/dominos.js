import { Order,Customer,Item,Payment,NearbyStores,Tracking } from 'dominos';
import { decrypt } from './encryption.js';

export async function checkStore(address){
    let storeID=0;
    let distance=100;
    //find the nearest store
    const nearbyStores=await new NearbyStores(address);
    //inspect nearby stores
    //console.log('\n\nNearby Stores\n\n')
    //console.dir(nearbyStores,{depth:5});
    //get closest delivery store
    for(const store of nearbyStores.stores){
        //inspect each store
        //console.dir(store,{depth:3});
        
        if(
            //we check all of these because the API responses seem to say true for some
            //and false for others, but it is only reliably ok for delivery if ALL are true
            //this may become an additional method on the NearbyStores class.
            store.IsOnlineCapable 
            && store.IsDeliveryStore
            // && store.IsOpen
            // && store.ServiceIsOpen.Delivery
            && store.MinDistance<distance
        ){
            distance=store.MinDistance;
            storeID=store.StoreID;
            
            
        }
    }

    return storeID ===0?0:1

}

export async function order(user){
    const pizza=new Item(
        {
            //16 inch hand tossed crust
            code:'14SCREEN',
            options:{
                //sauce, whole pizza : normal
                X: {'1/1' : '1'}, 
                //cheese, whole pizza  : double 
                C: {'1/1' : '1'},
                //pepperoni, whole pizza : double 
                P: {'1/1' : '1'}
            }
        }
    );
    
    const customer = new Customer(
        {
            //this could be an Address instance if you wanted 
            address: user.customer.address,
            firstName: user.customer.firstName,
            lastName: user.customer.lastName,
            //where's that 555 number from?
            phone: user.customer.phone,
            email: user.customer.email
        }
    );
    
    let storeID=0;
    let distance=100;
    //find the nearest store
    const nearbyStores=await new NearbyStores(customer.address);
    
    //inspect nearby stores
    //console.log('\n\nNearby Stores\n\n')
    //console.dir(nearbyStores,{depth:5});
    
    
    //get closest delivery store
    for(const store of nearbyStores.stores){
        //inspect each store
        //console.dir(store,{depth:3});
        
        if(
            //we check all of these because the API responses seem to say true for some
            //and false for others, but it is only reliably ok for delivery if ALL are true
            //this may become an additional method on the NearbyStores class.
            store.IsOnlineCapable 
            && store.IsDeliveryStore
            && store.IsOpen
            && store.ServiceIsOpen.Delivery
            && store.MinDistance<distance
        ){
            distance=store.MinDistance;
            storeID=store.StoreID;
            //console.log(store)
        }
    }
    
    if(storeID==0){
        return {message : "No stores are open for delivery", status: false};
    }
    
    //console.log(storeID,distance);
    
    
    //create
    const order=new Order(customer);
    
    // console.log('\n\nInstance\n\n');
    // console.dir(order,{depth:0});
    
    order.storeID=storeID;
    // add pizza
    order.addItem(pizza);
    //validate order
    await order.validate();
    
    // console.log('\n\nValidate\n\n');
    //console.dir(order,{depth:3});
    
    //price order
    await order.price();
    
    // console.log('\n\nPrice\n\n');
    // console.dir(order,{depth:0});
    
    //grab price from order and setup payment
    const myCard=new Payment(
        {
            amount:order.amountsBreakdown.customer,
            
            // dashes are not needed, they get filtered out
            number:decrypt(user.card.number),
            
            //slashes not needed, they get filtered out
            expiration: decrypt(user.card.expiration),
            securityCode:decrypt(user.card.securityCode),
            postalCode: decrypt(user.card.postalCode),
            tipAmount: user.tipAmount
        }
    );
    
    order.payments.push(myCard);
    
    //place order
    
    try{
        //will throw a dominos error because
        //we used a fake credit card
        const wait = order.estimatedWaitMinutes;
        await order.place();
    
        console.log('\n\nPlaced Order\n\n');
        console.dir(order,{depth:3});
        return {message : "Pizza Ordered! Should be there in " + wait, status: true};
    
    }catch(err){
        console.trace(err);
    
        //inspect Order Response to see more information about the 
        //failure, unless you added a real card, then you can inspect
        //the order itself
        console.log('\n\nFailed Order Probably Bad Card, here is order.priceResponse the raw response from Dominos\n\n');
        console.dir(
            order.placeResponse,
            {depth:5}
        );
        return {message : "Failed Order Probably Bad Card", status: false};
    }
}


export async function track(number){
    const tracking=new Tracking();
    const trackingResult=await tracking.byPhone(number);
    return {orderStatus: trackingResult.deliveryStatus, estimatedWait: trackingResult.estimatedWaitMinutes}
}