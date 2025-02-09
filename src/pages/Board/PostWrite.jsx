import React from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./Board.module.css";
import Nav from "../../components/Navbar/Nav";
import Foot from "../../components/Footer/Foot";
import RealEstatePostWrite from "./RealEstate/RealEstatePostWrite";
import GeneralPostWrite from "./General/GeneralPostWrite";



function PostWrite() {

    const { category, id } = useParams();

  return (
    <div>
        <Nav />
        <div className={styles.writeContainer}>
          <div className={styles.paper}>
              <h1>글 쓰기</h1>
          </div>
        
          {category.trim() === "real_estate" ? (
            <RealEstatePostWrite category={category} id={id}/>
          ) : (
            <GeneralPostWrite category={category} id={id}/>
          )}

      </div>
      <div style={{ paddingTop: "10%" }} />
      <Foot />
    </div >
  );
}

export default PostWrite;