"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../../axios/instance"; // Ensure axiosInstance is set correctly

interface Candidate {
  id: number;
  name: string;
  score: number;
  status: string; // Status can be Complete, In-progress, Pending, etc.
}

const LeaderBoard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("form");

  useEffect(() => {
    // Fetch candidates from the backend
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/get_all_candidates"); // Replace with actual endpoint
        setCandidates(response.data.candidates);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching candidates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Handle sending the email for all candidates
  const sendEmail = async (subject: string, body: string) => {
    try {
      const response = await axiosInstance.post("/send_email/", {
        email: "jafarman2007@gmail.com", // Use the actual recipient email
        subject: subject,
        body: body,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Handling sending form or interview to all candidates
  const handleSendToAll = () => {
    console.log(`Sending ${selectedOption} to all candidates...`);
    // Example email data
    const subject = `Sending ${selectedOption} to all candidates`;
    const body = `This is the body of the email for sending ${selectedOption} to all candidates.`;
    sendEmail(subject, body); // Sending email when the button is clicked
  };

  return (
    <div className="w-full h-screen p-4 overflow-y-auto pb-[80px]">
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error fetching candidates.</p>}

      {/* Global "Send to All" buttons */}
      <div className="mb-4">
        <button
          onClick={handleSendToAll}
          className="px-4 py-2 border text-white rounded mr-4"
        >
          Отправить Форму всем
        </button>
      </div>

      <div className="overflow-y-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Rank</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Score</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={candidate.id} className="border-b">
                <td className="px-4 py-2 flex justify-center items-center text-[20px]">{index + 1}</td>
                <td className="px-4 py-2">{candidate.name}</td>
                <td className="px-4 py-2">{candidate.score}</td>
                <td className="px-4 py-2">{candidate.status}</td>
                <td className="px-4 py-2 flex justify-center items-center">
                  <button
                    onClick={() => {
                      sendEmail("Прохождениие формы", `http://localhost:3000/candidate/form \n Логин: *3196669800036bf83b0039ed1f6a5075425a75* \n Пароль: *123456789*`);
                    }}
                    className="px-4 py-2 border text-white rounded mr-2"
                  >
                    Форма
                  </button>
                  <button
                    onClick={() => {
                      sendEmail("Прохождение интервью", `http://localhost:3000/interview?topic=frontend?id=3196669800036bf83b0039ed1f6a5075425a75`);
                    }}
                    className="px-4 py-2 border text-white rounded"
                  >
                    Интервью
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
