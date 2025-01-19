import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../Board.module.css";
import { Card } from "antd";
import { useLocation } from "react-router";
import { useAuth } from '../../../components/common/AuthContext';
import { getProductType } from "../../../components/Board/getProductType";
import { getProductStatus } from "../../../components/Board/getProductStatus";
import { getLocation } from "../../../components/Board/getLocation";
import { getKorSubCategories } from "../../../components/Board/getKorSubCategories";


function RealEstateList({category}) {
  
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = location.state?.keyword;
  const { userRole } = useAuth();
  const { Meta } = Card;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const [noticeList, setNoticeList] = useState([]);
  const [subCategory, setSubCategory] = useState("TOTAL");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  
  const localStorageKey = `pinnedItems_${category}`;
  const [pinnedItems, setPinnedItems] = useState(() => {
    // 컴포넌트가 처음 렌더링될 때 `localStorage`에서 핀 데이터를 가져옴
    const savedPinnedItems = localStorage.getItem("pinnedItems");
    return savedPinnedItems ? JSON.parse(savedPinnedItems) : [];
  });
  
  const getFilteredPosts = (selected) => {
    setSubCategory(selected);
  };

  const togglePin = (record) => {
    let updatedPinnedItems;

    if (pinnedItems.some((pinned) => pinned.id === record.id)) {
      // 이미 핀된 게시글을 제거
      updatedPinnedItems = pinnedItems.filter((pinned) => pinned.id !== record.id);
    } else {
      // 새 게시글을 핀에 추가
      updatedPinnedItems = [...pinnedItems, record];
    }
    setPinnedItems(updatedPinnedItems);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedPinnedItems)); // 카테고리별 고정게시글 저장
  };

  const truncateString = (str, maxLength) => {
    if (!str) return ''; // 문자열이 없을 때
    return str.length > maxLength ? str.slice(0, maxLength) + '..' : str;
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

const getLocationByValue = (category, value) => {
    const locations = getLocation(category);
    const location = locations.find(loc => loc.value === value);
    return location ? location.label : null; // 해당 value가 없으면 null 반환
};

const getProductStatusByValue = (category, value) => {
    const locations = getProductStatus(category);
    const location = locations.find(loc => loc.value === value);
    return location ? location.label : null; // 해당 value가 없으면 null 반환
};

const getProductTypeByValue = (category, value) => {
    const locations = getProductType(category);
    const location = locations.find(loc => loc.value === value);
    return location ? location.label : null; // 해당 value가 없으면 null 반환
};


  useEffect(() => {
    window.scrollTo(0, 0);

    if (category === "real_estate") {
        setType("real-estate");
    } else {
        setType("posts");
    }
    
    const savedPinnedItems = localStorage.getItem(localStorageKey);
    setPinnedItems(savedPinnedItems ? JSON.parse(savedPinnedItems) : []);
  }, [category]);

  useEffect(() => {
    // 페이지가 로드될 때마다 subCategory를 초기화
    setSubCategory("TOTAL");
  }, [location.key]);

  useEffect(() => {

    if (category === "real_estate") {
        setType("real-estate");
    } else {
        setType("posts");
    }
    setBanners([]);
    setLoading(true);
    const fetchPost = async () => {
    axios
      .get(`${API_BASE_URL}/ads/banners?category=${String(category || "").toUpperCase()}`)
      .then((res) => {
        const data = res.data.data;
        setBanners(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
    if(type){
        fetchPost();
    }
  }, [category, API_BASE_URL]);

  useEffect(() => {

    if (category === "real_estate") {
        setType("real-estate");
    } else {
        setType("posts");
    }
    const fetchPosts = async () => {
      try {
        const url = keyword
          ? `${API_BASE_URL}/${type}/search?keyword=${keyword}`
          : `${API_BASE_URL}/${type}?category=${String(category || "").toUpperCase()}&subCategory=${subCategory}`;
        const res = await axios.get(url);

        if (res.status === 200) {
          let totalElements = res.data.data.length;
          let tmp = res.data.data.map((item, index) => ({
            ...item,
            key: totalElements - index,
            createdAt: convertToStringDate(item.createdAt),
          }));
          setNoticeList(tmp);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if(type){
      fetchPosts();
    }
  }, [category, type, keyword]);

  const mergedData = [
    ...pinnedItems,
    ...noticeList.filter(
      (item) => !pinnedItems.some((pinned) => pinned.id === item.id)
    ),
  ];

  return (
    <div style={{
        display: 'flex',
        flexWrap: 'wrap', // 줄바꿈 허용
        justifyContent: 'flex-start', // 좌측 정렬
      }}
      >
        {noticeList && (
        noticeList.map((notice, index) => (
            <Card
                key={index}
                hoverable
                className={styles.customCard}
                style={{
                    width: '13rem',
                    margin: '1rem', // 카드 간 간격
                    textAlign: 'left',
                }}
                cover={
                    <img 
                      alt={notice.title || "example"} 
                      src={notice.thumbnailUrl || "/static/img/no_image.png"} 
                      style={{
                        width: '11rem',
                        height: '11rem',
                        margin: '1rem auto',
                        objectFit: 'cover', // 이미지가 크기에 맞게 잘리도록 설정
                      }}
                    />
                    }
                    onClick={() => movePage(notice)}
                >
                  <Meta 
                    title={
                        <div style={{
                            display: 'block',
                            whiteSpace: 'wrap',
                            maxWidth: '10rem',
                          }}>
                            <div>{truncateString(notice.title, 20)}</div>
                            <div>{notice.price || "- "}AED</div>
                        </div>
                    }
                    description={
                        <div>
                          <div><b>{getProductTypeByValue(type.toUpperCase(), notice.productType) || "-"}</b></div>
                          <div><b>거래 형태 : </b>{getKorSubCategories(notice.subCategory.toUpperCase()) || "-"}</div>
                          <div><b>매물 상태 : </b>{getProductStatusByValue(type.toUpperCase(), notice.productStatus) || "-"}</div>
                          <div><b>실내 면적(sqf) : </b>{notice.innerArea || "-"}</div>
                          <div><b>전체 면적(sqf) : </b>{notice.totalArea || "-"}</div>
                          <div><b>위치 : </b>{getLocationByValue(type.toUpperCase(), notice.state) || "-"}</div>
                        </div>
                      } 
                  />
            </Card>
            ))
        )}
    </div>
  );
}

export default RealEstateList;