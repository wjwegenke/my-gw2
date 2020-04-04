import React from 'react';
import TradingPostItem from './TradingPostItem';

const TradingPostList = (props) => {
    let filteredItems = props.items.filter(item => {
        return props.filter.rarity.includes(item.rarity) //Rarity
            && props.filter.type.includes(item.type) //Rarity
            && (props.filter.minLevel == null || props.filter.minLevel <= item.level) //Min level
            && (props.filter.maxLevel == null || props.filter.maxLevel >= item.level) //Max level
            && (props.filter.minBuy == null || (item.prices?.buys?.unit_price !== undefined && props.filter.minBuy <= item.prices?.buys?.unit_price)) //Min buy
            && (props.filter.maxBuy == null || (item.prices?.buys?.unit_price !== undefined && props.filter.maxBuy >= item.prices?.buys?.unit_price)) //Max buy
            && (props.filter.minSell == null || (item.prices?.sells?.unit_price !== undefined && props.filter.minSell <= item.prices?.sells?.unit_price)) //Min sell
            && (props.filter.maxSell == null || (item.prices?.sells?.unit_price !== undefined && props.filter.maxSell >= item.prices?.sells?.unit_price)) //Max sell
    });

    //Generate JSX
    let itemJSXs = filteredItems.length === 0 ? (<div>Loading...</div>) :
        filteredItems.map(item => {
            return (
                <TradingPostItem item={item} key={item.id}/>
            );
        });

    return (
        <div>
            {itemJSXs}
        </div>
    );
}

export default TradingPostList;