import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SyllabusForm = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [syllabus, setSyllabus] = useState([
    { id: "1.1", topic: "", number: "1.1", _id: uuidv4() },
  ]);
  const [moduleCount, setModuleCount] = useState(1);

  const addTopic = () => {
    const lastTopic = syllabus.filter((s) =>
      s.id.startsWith(`${moduleCount}.`)
    ).length;
    const newId = `${moduleCount}.${lastTopic + 1}`;
    setSyllabus([
      ...syllabus,
      { id: newId, topic: "", number: newId, _id: uuidv4() },
    ]);
  };

  const addModule = () => {
    setModuleCount(moduleCount + 1);
    setSyllabus([
      ...syllabus,
      {
        id: `${moduleCount + 1}.1`,
        topic: "",
        number: `${moduleCount + 1}.1`,
        _id: uuidv4(),
      },
    ]);
  };

  const handleTopicChange = (index, value) => {
    const newSyllabus = [...syllabus];
    newSyllabus[index].topic = value;
    setSyllabus(newSyllabus);
  };

  const removeTopic = (index) => {
    const newSyllabus = syllabus.filter((_, i) => i !== index);
    setSyllabus(newSyllabus);
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      alert("Course Name is required!");
      return;
    }
    if (!courseCode.trim()) {
      alert("Course Code is required!");
      return;
    }

    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    const response = await fetch("http://localhost:5001/api/syllabus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ courseName, courseCode, syllabus }),
    });

    if (response.ok) {
      alert("Syllabus saved successfully!");
    } else {
      const errorData = await response.json();
      alert(`Error saving syllabus: ${errorData.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add Syllabus</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Course Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Syllabus Topics
          </label>
          <div className="space-y-2">
            {syllabus.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-300">{entry.id}</span>
                <input
                  type="text"
                  placeholder={`Topic ${entry.id}`}
                  value={entry.topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  className="block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
                />
                <button
                  onClick={() => removeTopic(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={addTopic}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Topic
          </button>
          <button
            onClick={addModule}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Module
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SyllabusForm;
