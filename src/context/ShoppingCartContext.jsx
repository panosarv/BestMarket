import { createContext, useContext,useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
const ShoppingCartContext=createContext()

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({children}){
    const [cartItems,setCartItems]=useState([])
    const [isOpen,setIsOpen]=useState(false)
    const cartQuantity = cartItems.reduce(
        (quantity,item)=>item.quantity+quantity,0
    )
   
    function getItemQuantity(id){
        return cartItems.find(item=>item.id===id)?.quantity||0
    }

    const openCart=()=>setIsOpen(true)
    const closeCart=()=>setIsOpen(false)

    function increaseCartQuantity(props){
        let id=props.productid?String(props.productid)+String(props.categoryid):props.categoryid
        let categoryid=props.categoryid
        let productid=props.productid
        let image=props.image
        let name=props.name 
        let isProduct=props.productid?true:false

        setCartItems(prevItems=>{
            if(prevItems.find(item=>item.id===id)==null){
                if(isProduct){
                    return [...prevItems,{id,productid,categoryid,isProduct,name,image,quantity:1}]
                }
                else{
                    return [...prevItems,{id,categoryid,isProduct,name,image,quantity:1}]
                }
            }
            else{
                return prevItems.map(item=>{
                    if(item.id===id){
                        return {...item,quantity:item.quantity+1}
                    }
                    else{
                        return item
                    }
                })
            }
            
        })
        console.log("Increase")
        console.log("CartItems:",cartItems)
    }

    function decreaseCartQuantity(id){
        setCartItems(prevItems=>{
            if(prevItems.find(item=>item.id===id)?.quantity===1){
                return prevItems.filter(item=>item.id!==id)
            }
            else{
                return prevItems.map(item=>{
                    if(item.id===id){
                        return {...item,quantity:item.quantity-1}
                    }
                    else{
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id){
        setCartItems(prevItems=>{
            return prevItems.filter(item=>item.id!==id)
        })
    }

    return(
    <ShoppingCartContext.Provider value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                cartItems,
                cartQuantity,
                closeCart,
                openCart
                }}>
        <ShoppingCart isOpen={isOpen}/>
        {children}
    </ShoppingCartContext.Provider>
    )
}



