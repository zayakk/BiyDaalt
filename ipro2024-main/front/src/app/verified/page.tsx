"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";

interface Data {}
interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size: number;
  action: string;
  curdate: string;
}

export default function Verified() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially set to true, as we need to check the login state first
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError("Token is missing");
        return;
      }

      try {
        let surl = `http://localhost:8000/user?token=${token}`;
        let smethod = "GET";
        let sbody = {};

        const response: Response = await sendRequest(surl, smethod);
        console.log(response.resultMessage);
        if (response.resultCode === 3010) {
          setSuccessMessage(response.resultMessage);
          setError("");
        } else if (response.resultCode === 3011) {
          setSuccessMessage(response.resultMessage);
          setError("");
        } else {
          setSuccessMessage("");
          setError(response.resultMessage);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <p style={{ color: "green" }}>{successMessage}</p>
      <p style={{ color: "red" }}>{error}</p>
    </>
  );
}
