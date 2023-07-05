import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { jwtState } from "..";
import { useEffect } from "react";
import { REST_SERVER_ADDRESS } from "../common/Constant";
import NavBar from "../component/NavBar";

function KakaoCallBackPage() {
    const [searchParams, _] = useSearchParams();
    const [_jwt, setJwt] = useRecoilState(jwtState);
    console.log(searchParams.get("code"));
    window.alert(_jwt);
    // 코드를 api로 보내줘야 됨.
    useEffect(() => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/oauth/kakao", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("code=" + searchParams.get("code"));
        window.alert(xhr.responseText);
        const response = JSON.parse(xhr.responseText);

        window.opener.postMessage({
            "type": "kakaoAuth",
            "jwtToken": response.token,
            "userEmail": response.userEmail
        });
        window.close();
    }, []);



    return (
        <div className="container mt-5 pt-3">
            <NavBar />
            <>
                <div className="d-flex justify-content-center m-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        </div>
    );
}

export default KakaoCallBackPage;