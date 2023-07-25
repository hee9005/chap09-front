import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "../..";
import { useNavigate } from "react-router-dom";
import { REST_SERVER_ADDRESS } from "../../common/Constant";
import NavBar from "../../component/NavBar";

function DeactivatePage() {
    const passRef = useRef();
    const [step, setStep] = useState(0);
    const [error, setError] = useState(false);
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);
    const navigate = useNavigate();
    const deactivateHandle = (evt) => {
        // 패스워드 뽑아서 .. API 호출
        const xhr = new XMLHttpRequest();
        const password = passRef.current.value;
        console.log(password);
        xhr.open("DELETE", REST_SERVER_ADDRESS + "/api/v1/user/private" ,false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send("password="+ passRef.current.value);
        if (xhr.status === 200) {
            window.alert("계정삭제가 완료되었습니다.")
            navigate("/");
            setJwt(null);
            // 일단 완성==============
        }else{
        // 처리결과에 따라 UI 변경
        setStep(0);
        setError(true);
        setTimeout(() => {
            setError(false);
        }, 3000)
              }
    };
    return (
        <div className="container mt-5 pt-3">
            <NavBar />
            <>
                {step === 0 && <>
                    <h3>계정이 삭제됩니다.</h3>
                    <div>
                        기타 알아야할 상황들
                    </div>
                    <button className="btn btn-danger" onClick={(evt) => {
                        setStep(1);
                    
                    }}>다음</button>
                     
                    {error && <div className="alert alert-danger" role="alert">
                        A simple danger alert—check it out!
                    </div>}
                </>
                }
                {
                    step === 1 && <>
                        <h3>암호를 확인합니다.</h3>
                        <small>당신의 계정에 설정된 비밀번호를 입력하세요</small>
                       <div>
                            {userEmail.endsWith("@kakao.user") ?
                                <>
                                    <input type="password" className="form-cintroll" disabled
                                        placeholder="소셜가입자는 비밀번호를 입력하지 않습니다." />

                                </>
                                :
                                <>
                                    <input type="password" placeholder="비밀번호" ref={passRef} />
                                </>
                            }
                        </div>
                        <button className="btn btn-danger" onClick={deactivateHandle}>삭제</button>
                    </>
                }
            </>
        </div>
    );
}

export default DeactivatePage;