import React, { useContext, useEffect, useRef, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

import { menu_list, assets } from "../../assets/assets";

function FoodDisplay({ category }) {
  const { food_list, search } = useContext(StoreContext);
  const [dietary, setDietary] = useState("All"); // All, Veg, Non-Veg
  const displayRef = useRef(null);

  useEffect(() => {
    if (search.length > 0 && displayRef.current) {
        displayRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [search]);

  // Filter based on category and search query
  const getFilteredItems = () => {
    return food_list.filter(item => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filtered_all = getFilteredItems();

  return (
    <div className="food-display" id="food-display" ref={displayRef}>
      <div className="food-display-header">
        <h2 className="h2we">
          {search ? `Search results for "${search}"` : "Top dishes near you"}
        </h2>
        <div className="food-filters">
            <button 
                className={`filter-btn ${dietary === "All" ? "active" : ""}`} 
                onClick={() => setDietary("All")}
            >All</button>
            <button 
                className={`filter-btn ${dietary === "Veg" ? "active" : ""}`} 
                onClick={() => setDietary("Veg")}
            >Veg</button>
            <button 
                className={`filter-btn ${dietary === "Non-Veg" ? "active" : ""}`} 
                onClick={() => setDietary("Non-Veg")}
            >Non-Veg</button>
        </div>
      </div>

      <div className="food-display-list-container">
        {filtered_all.length === 0 ? (
          <div className="no-results">
            <img src={assets.search_icon} alt="No results" className="no-results-icon" />
            <p>We couldn't find any dishes matching your search.</p>
            <span>Try searching for something else!</span>
          </div>
        ) : (
          menu_list.map((menu_item, menu_index) => {
            if (category === "All" || category === menu_item.menu_name) {
              let filtered_list = filtered_all.filter(item => item.category === menu_item.menu_name);
              
              // Apply Smart Dietary Filter
              const isVeg = (item) => {
                  if (item.name.toLowerCase().includes("chicken")) return false;
                  return item.veg;
              }

              if (dietary === "Veg") {
                  filtered_list = filtered_list.filter(item => isVeg(item) === true);
              } else if (dietary === "Non-Veg") {
                  filtered_list = filtered_list.filter(item => isVeg(item) === false);
              }

              if (filtered_list.length > 0) {
                const veg_items = filtered_list.filter(item => isVeg(item));
                const non_veg_items = filtered_list.filter(item => !isVeg(item));

                return (
                  <div key={menu_index} className="food-display-section" id={`section-${menu_item.menu_name}`}>
                    <h3 className="food-section-title">{menu_item.menu_name}</h3>
                    
                    {veg_items.length > 0 && (
                      <div className="dietary-section">
                        <h4 className="dietary-title veg">Vegetarian Specialities</h4>
                        <div className="food-display-list">
                          {veg_items.map((item, index) => (
                            <FoodItem
                              key={index}
                              id={item._id}
                              name={item.name}
                              description={item.description}
                              price={item.price}
                              image={item.image}
                              veg={item.veg}
                              inStock={item.inStock}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {non_veg_items.length > 0 && (
                      <div className="dietary-section">
                        <h4 className="dietary-title non-veg">Non-Vegetarian Specialities</h4>
                        <div className="food-display-list">
                          {non_veg_items.map((item, index) => (
                            <FoodItem
                              key={index}
                              id={item._id}
                              name={item.name}
                              description={item.description}
                              price={item.price}
                              image={item.image}
                              veg={item.veg}
                              inStock={item.inStock}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            }
            return null;
          })
        )}
      </div>
    </div>

  );
}

export default FoodDisplay;
