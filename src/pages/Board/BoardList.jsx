import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Board.module.css";
import { Paper } from "@mui/material";
import { Table } from "antd";
import WriteButton from "../../components/Board/WriteButton";
import SubCategoryButton from "../../components/Board/SubCategoryButton";
import { useLocation } from "react-router";
import { getKorCategories } from "../../components/Board/getKorCategories"


function BoardList({category}) {  // lower case
  
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = location.state?.keyword;
  
  const [noticeList, setNoticeList] = useState();
  const [subCategory, setSubCategory] = useState("TOTAL");
  
  const getFilteredPosts = (selected) => {
    setSubCategory(selected);
  };

  const movePage = (item) => {
    let id = item.id + "";

    if (category !== "search") {
      navigate(`/board/${category}/${id}`, { state: {prev: item.prev, next: item.next, subCategory: subCategory } });
    }
    else if (keyword) {
      navigate(`/board/${category}/${id}`, { state: {prev: item.prev, next: item.next } });
    }

  };

  const convertToStringDate = (param) => {
    let result = param.substr(0,10);
    return result;
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      align: "center",
      width: "2%",
    },
    {
      title: "제목",
      dataIndex: "title",
      align: "center",
      width: "40%"
    },
    {
      title: "작성자",
      dataIndex: "author",
      align: "center",
      width: "10%"
    },
    {
      title: "작성날짜",
      dataIndex: "createdAt",
      align: "center",
      width: "10%",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: "좋아요",
      dataIndex: "like",
      align: "center",
      width: "2%",
      sorter: (a, b) => a.like - b.like,
    },
    {
      title: "조회수",
      dataIndex: "view",
      align: "center",
      width: "2%",
      sorter: (a, b) => a.view - b.view,
    },
  ];

  useEffect(() => {
    // 페이지가 로드될 때마다 subCategory를 초기화
    setSubCategory("TOTAL");
  }, [location.key]);

  useEffect(() => {
    if(keyword){
      axios
      .get(`https://localhost:8443/posts/search?keyword=${keyword}`)
      .then((res) => {
        if (res.status === 200) {
          let totalElements = res.data.data.length;
          let tmp = res.data.data;
          tmp.map((item, index) => {
            item.key = totalElements - index;
            item.createdAt = convertToStringDate(item.createdAt);
          });
          tmp && setNoticeList(tmp);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
    axios
      .get(`https://localhost:8443/posts?category=${String(category || '').toUpperCase()}&subCategory=${subCategory}`)
      .then((res) => {
        if (res.status === 200) {
          let totalElements = res.data.data.length;
          let tmp = res.data.data;
          tmp.map((item, index) => {
            item.key = totalElements - index;
            item.createdAt = convertToStringDate(item.createdAt);
          });
          tmp && setNoticeList(tmp);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }, [category, subCategory]);

  return (
    <div className={styles.container}>
      <h1>{getKorCategories(category)}</h1>
      <div className={styles.datagrid}>
        <Paper elevation={0} square className={styles.paper}>
          <div className={styles.buttonContainer}>
            {!keyword && (
                <SubCategoryButton
                  category={category.toUpperCase()}
                  onSubCategoryChange={(selectedCategory) => getFilteredPosts(selectedCategory)}
                />
            )}
            <WriteButton />
          </div>
          {noticeList && (
              <Table
                  columns={columns}
                  dataSource={noticeList}
                  rowClassName={styles.tableRow}
                  size="middle"
                  pagination={{
                  position: ["none", "bottomRight"],
                  }}
                  onRow={(record, rowIndex) => {
                  return {
                      onClick: (event) => {
                      movePage(record);
                      },
                  };
                  }}
            />
          )}
        </Paper>
    </div>
    </div>
  );
}

export default BoardList;