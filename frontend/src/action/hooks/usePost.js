import { useEffect, useState } from "react";
import axios from "axios";

function usePost(target, body) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //로그인 이후 리덕스 저장소에서 토큰 들고오기
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzcGVha29uIiwibmFtZSI6IuydtO2drOyImCIsImlkIjo0NiwiZXhwIjoxNjc2NTA3ODMwLCJpYXQiOjE2NzQ2OTM0MzAsInVzZXJJZCI6Imtha2FvXzI2Mjk4Mzk0NjIifQ.R7JuJDcrX13tpKqqHxq_MDcNOzASPZUYPnLWlevKzmePM6InZPe3YEy0XkTD-HqRADzkpB2p9UYFcVYnwQwzBA";

  useEffect(() => {
    axios
      .post(target, body, { headers: { Authorization: token } })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err))
      .finally(()=>{
        setIsLoading(false)
      })
  }, [target]);

  return {data, isLoading};
}

export default usePost;
