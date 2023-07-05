import { useRecoilState } from "recoil";
import { jwtState } from "..";
import FeedBriefCard from "../component/feed/FeedBreifCard";
import { useEffect, useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/Constant";
import NavBar from "../component/NavBar";


function HomePage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [count, setCount] = useState(0);
    const [feeds, setFeeds] = useState([]);
    const formRef = useRef();
    const fileRef = useRef();
    const imgRef = useRef();
    const [page, setPage] = useState(1);
    // 최신 피드 얻어오기
    const updateFeed = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/feed/readAll?page="+page, false);
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setCount(body.total);
            setFeeds([...feeds,...body.feeds]);
            setPage(page+1);
        } else {
            // 데이터를 못 불러올때를 고려해서 작업 추가
        }
    };

    useEffect(updateFeed, []);

    const submitHandle = (evt) => {
        evt.preventDefault();
        const arraches=formRef.current.arraches.files;
        // 글 등록해주는 API 사용해주고
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS+"/api/v1/feed/new-create",false);
        xhr.setRequestHeader("Authorization", jwt);
        const formdate = new FormData();
        formdate.append("description",formRef.current.description.value);
        if (arraches.length != 0){
            for(var file of arraches){
                formdate.append("arraches",file);
            }
         
        }
        xhr.send(formdate);
        if (xhr.status === 201) {
            // 글 정상 등록되면
            formRef.current.arraches.value = "";
            formRef.current.description.value="";
            window.alert("정보변경이 처리되었습니다.");
    }
        updateFeed();   // 
    }
    // const fileChangeHandle = (evt) => {
    //     const arraches=formRef.current.arraches.files;
    //     if (!arraches)
    //         return;
    //     const reader = new FileReader();
    //     reader.readAsDataURL(arraches); // 비동기
    //     reader.onload = function (e) {
    //         // console.log(reader.result);
    //         imgRef.current.src = reader.result;
    //     }
    // }
    document.onscroll = (evt) => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            updateFeed();
        }
    };
    return (<>
        <NavBar />
        <div className="container mt-5 pt-3" >
            {jwt && 
             <form ref={formRef} onSubmit={submitHandle}>
            <div className="card">
              
                <div className="card-body">
                    <div>
                        <textarea className="form-control-plaintext" style={{ resize: "none" }} name="description"></textarea>
                    </div>
                    <div className="d-flex flex-wrap">
                    <img ref={imgRef} />
                    </div>
                    <div>
                    <input type="file" accept="image/*" name="arraches" /*onChange={fileChangeHandle}*/ multiple/>
                        {/* <button className="btn btn-sm btn-secondary"><i className="bi bi-file-image"></i></button> */}
                    </div>
                </div>
            </div>
            <div className="mt-1">
            <button type="submit" className="form-control btn">등록</button>
            </div>
                </form>
            }
            {
                feeds && feeds.map(one => <div className="card mt-1">
                    <div className="card-header">
                        <img src={one.witer.profileImage} style={{ width: 32 }} />
                        {one.witer.name}    <small>{one.witer.email} </small>
                    </div>
                    <div className="card-body">
                        <div>
                            {one.description}
                        </div>
                        <div>
                            {one.feedAttachs.map(a => <img src={a.mediaUrl} style={{width: 150}}/>)}
                        </div>
                    </div>
                </div>)
            }
            {/* <FeedBriefCard /> */}
            </div>
          
            </>);
}

export default HomePage;