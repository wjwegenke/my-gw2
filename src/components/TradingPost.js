import React, {useState, useEffect} from 'react';
import TradingPostSearch from './TradingPostSearch';
import TradingPostList from './TradingPostList';
import axios from 'axios';

const TradingPost = () => {
    const [filter, setFilter] = useState({
        type: ['Armor', 'Weapon'],
        rarity: ['Rare', 'Exotic'],
        minLevel: 68,
        maxLevel: 80,
        maxBuy: 1650,
    });
    const [items, setItems] = useState([]);
    const [itemPrices, setItemPrices] = useState([]);


    async function getPrices(itemList) {
        let itemIds = itemList.map(item => item.id);
        //Get current prices
        let startIndex = 0;
        let endIndex = Math.min(itemIds.length - 1, 200);
        while (startIndex < itemIds.length)
        {
            let queryIds = itemIds.slice(startIndex, endIndex).join();
            let pricesResposne = { data: [] };
            try {
                pricesResposne = await axios.get('https://api.guildwars2.com/v2/commerce/prices?ids=' + queryIds);
            } catch (err) {
                console.log(err)   
            }
            //Add prices to items
            pricesResposne.data.forEach(prices => {
                itemList.find(item => {
                    if (item.id === prices.id)
                    {
                        item.prices = prices;
                        return true;
                    }
                    return false;
                });
            });
            startIndex += 200;
            endIndex = Math.min(itemIds.length - 1, startIndex + 200);
        }
        setItemPrices(itemList);
    }

    useEffect(() => {
        async function fetchData() {
            //Get Item ID list
            let idsResponse = await axios.get('https://api.guildwars2.com/v2/items');
            
            //Get items
            let itemIds = idsResponse.data;
            let startIndex = 0;
            let endIndex = Math.min(itemIds.length - 1, 200);
            let itemList = [];
            while (startIndex < itemIds.length)
            {
                let queryIds = itemIds.slice(startIndex, endIndex).join();
                let itemsResposne = { data: [] };
                try {
                    itemsResposne = await axios.get('https://api.guildwars2.com/v2/items?ids=' + queryIds);
                } catch (err) {
                    console.log(err)   
                }
                itemList = itemList.concat(itemsResposne.data);
                startIndex += 200;
                endIndex = Math.min(itemIds.length - 1, startIndex + 200);
            }

            //Filter Items to Sellable Items
            itemList = itemList.filter(item => {
                return !item.flags.includes('NoSell');
            });
            // itemIds = itemList.map(item => item.id);

            // //Get current prices
            // startIndex = 0;
            // endIndex = Math.min(itemIds.length - 1, 200);
            // while (startIndex < itemIds.length)
            // {
            //     let queryIds = itemIds.slice(startIndex, endIndex).join();
            //     let pricesResposne = { data: [] };
            //     try {
            //         pricesResposne = await axios.get('https://api.guildwars2.com/v2/commerce/prices?ids=' + queryIds);
            //     } catch (err) {
            //         console.log(err)   
            //     }
            //     //Add prices to items
            //     pricesResposne.data.forEach(prices => {
            //         itemList.find(item => {
            //             if (item.id === prices.id)
            //             {
            //                 item.prices = prices;
            //                 return true;
            //             }
            //             return false;
            //         });
            //     });
            //     startIndex += 200;
            //     endIndex = Math.min(itemIds.length - 1, startIndex + 200);
            // }
            // console.log(itemList);
            setItems(itemList);
        }
        fetchData();
    }, []);
    useEffect(() => {
        getPrices(JSON.parse(JSON.stringify(items)));
    }, [items]);

    const search = (_filter) =>
    {
        setFilter(_filter);
    }

    return (
        <div>
            <TradingPostSearch search={search}/>
            <TradingPostList items={itemPrices} filter={filter}/>
        </div>
    )
}

export default TradingPost;