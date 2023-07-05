import { useEffect, useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../../common/Constant";
import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "../..";
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/NavBar";

function ProfilePage() {
    const navigate = useNavigate();
    const nameRef = useRef();
    const [jwt, setJwt] = useRecoilState(jwtState);
    const imgRef = useRef();
    const fileRef = useRef();
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);
    // useEffect 특정 상태에 변경이 될때마다 자동 처리되는 함수등록
    useEffect(() => {
        if(!jwt)
        return;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/user/private", false);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
        const result = JSON.parse(xhr.responseText);
        // json 안에는 code 라는 number가 있고 , user : 객체가 있음
        imgRef.current.src = result.user.profileImage;
        nameRef.current.value = result.user.name;
    }, [jwt]);// 2번째 인자 [] 을 비워두면 맨처음 한번 렌더링되고 난 이후만 작동

    //=================================================================

    const changeHandel = (evt) => {
        evt.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/private/info", false);
        // xhr.setRequestHeader("content-type", "multipart/form-data"); // 수동설정하니끼까 CORS 
        xhr.setRequestHeader("Authorization", jwt);
        const formdate = new FormData();
        formdate.append("name", nameRef.current.value);
        if (fileRef.current.files.length != 0)
            formdate.append("profile", fileRef.current.files[0]);
        xhr.send(formdate);
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            // json 안에는 code 라는 number 가 있고, user : 객체가 있음

            imgRef.current.src = result.user.profileImage;
            nameRef.current.value = result.user.name;
            window.alert("정보변경이 처리되었습니다.");
            fileRef.current.value = "";
        } else {
            window.alert("정보변경에 실패하였습니다.");

        }
    }
    // 이미지 파일 미리보기 스크립트
    const fileChangeHandle = (evt) => {
        const file = fileRef.current.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 비동기
        reader.onload = function (e) {
            // console.log(reader.result);
            imgRef.current.src = reader.result;
        }
    }
    // 이미지를 눌렀을 때 파일 누른 효과 주기
    const imgClickHandle = (evt) => {
        fileRef.current.dispatchEvent(new MouseEvent("click"));
    }
    return (<>
        <div className="container mt-5 pt-3">
            <NavBar />
            <div className="container pt-3">
                <h4>#개인정보수정</h4>
                <form onSubmit={changeHandel}>
                    <p>
                        <img ref={imgRef} onClick={imgClickHandle} />
                        <input type="file" accept="image/*" ref={fileRef} onChange={fileChangeHandle}
                            style={{ display: "none" }} />
                    </p>
                    <p>
                        <input type="text" ref={nameRef} />
                    </p>
                    <button type="submit">수정</button>
                </form>
            </div>
        </div>
    </>);
}

export default ProfilePage;