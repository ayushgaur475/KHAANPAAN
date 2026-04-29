import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import AboutSection from '../../components/AboutSection/AboutSection'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

function Home() {
  const [category, setCategory] = useState("All")
  return (
    <div>
      <Header></Header>
      <AboutSection></AboutSection>
      <ExploreMenu category={category} setCategory={setCategory}></ExploreMenu>
      <FoodDisplay category={category}></FoodDisplay>
    </div>
  )
}

export default Home
