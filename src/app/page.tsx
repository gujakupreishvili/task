"use client";
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { Reorder } from "framer-motion";

interface TodoItem {
  text: string;
  checked: boolean;
}

interface Container {
  id: number;
  color: string;
}

export default function Home() {
  const [checkCol, setCheckCol] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Container[]>(() => {
    const savedColors = localStorage.getItem("selectedColors");
    return savedColors ? JSON.parse(savedColors) : [];
  });
  const [tasks, setTasks] = useState<{ [key: number]: string }>({});
  const [todos, setTodos] = useState<{ [key: number]: TodoItem[] }>({});
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);


  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCol = () => {
    setCheckCol(!checkCol);
  };

  const handleColorSelect = (color: string) => {
    const lastIndex = selectedColors[selectedColors.length - 1]?.id || 0;
    const newCont = {
      id: lastIndex + 1,
      color: color,
    };
    const updatedColors = [...selectedColors, newCont];
    setSelectedColors(updatedColors);
    localStorage.setItem("selectedColors", JSON.stringify(updatedColors));
  };

  const handleEnterKeyPress = (
    event: KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask(id);
    }
  };

  const addTask = (id: number) => {
    const newTask = { text: tasks[id], checked: false };

    if (!newTask.text.trim()) {
      alert("Please write something");
      return;
    }

    const updatedTodos = {
      ...todos,
      [id]: [...(todos[id] || []), newTask],
    };

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTasks({ ...tasks, [id]: "" });
  };

  const removeItem = (id: number, index: number) => {
    if (todos[id][index].checked) {
      const updatedTodos = todos[id].filter((_, idx) => idx !== index);
      const newTodos = { ...todos, [id]: updatedTodos };
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
    } else {
      alert("Please check the item first");
    }
  };

  const handleCheckboxChange = (id: number, index: number) => {
    const updatedTodos = todos[id].map((item, idx) =>
      idx === index ? { ...item, checked: !item.checked } : item
    );
    const newTodos = { ...todos, [id]: updatedTodos };
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleDeleteColor = (colorId: number) => {
    const updatedColors = selectedColors.filter((color) => color.id !== colorId);
    setSelectedColors(updatedColors);
    localStorage.setItem("selectedColors", JSON.stringify(updatedColors));
    const {  ...updatedTodos } = todos;

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <>
      <div className="absolute right-[25px] bottom-[25px] bg-black w-[40px] h-[40px] flex items-center justify-center rounded-md cursor-pointer">
        <FaPlus className="text-white" onClick={handleCol} />
      </div>

      {checkCol && (
        <div className="flex flex-col absolute right-[35px] bottom-[80px] gap-[10px]">
          <div
            className="bg-yellow-400 w-[35px] h-[35px] rounded-2xl cursor-pointer"
            onClick={() => handleColorSelect("yellow-400")}
          ></div>
          <div
            className="bg-red-500 w-[35px] h-[35px] rounded-2xl cursor-pointer"
            onClick={() => handleColorSelect("red-500")}
          ></div>
          <div
            className="bg-purple-500 w-[35px] h-[35px] rounded-2xl cursor-pointer"
            onClick={() => handleColorSelect("purple-500")}
          ></div>
          <div
            className="bg-pink-500 w-[35px] h-[35px] rounded-2xl cursor-pointer"
            onClick={() => handleColorSelect("pink-500")}
          ></div>
        </div>
      )}

      {mounted && (
        <Reorder.Group
          className="flex flex-col justify-center items-center gap-4 mt-8"
          axis="y"
          values={selectedColors}
          onReorder={setSelectedColors}
        >
          {selectedColors.map((color) => (
            <Reorder.Item
              key={color.id}
              value={color}
              className={`w-[300px] bg-${color.color} flex flex-col pb-[25px]`}
            >
              <div className="flex justify-end py-[12px] px-[12px] gap-[10px]">
                <TiDelete
                  className="text-[23px] text-white cursor-pointer"
                  onClick={() => handleDeleteColor(color.id)}
                />
                <IoMdCloudDownload className="text-[23px] text-white cursor-pointer" />
              </div>
              <div className="flex justify-center mt-[10px] gap-[20px]">
                <input
                  type="text"
                  className="p-2 border border-gray-400 rounded"
                  placeholder="Enter your task..."
                  value={tasks[color.id] || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTasks({ ...tasks, [color.id]: e.target.value })
                  }
                  onKeyPress={(e) => handleEnterKeyPress(e, color.id)}
                />
                <button
                  className="bg-green-500 w-[60px] h-[40px] rounded-md"
                  onClick={() => addTask(color.id)}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                {todos[color.id]?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between w-full px-[20px] py-[10px]"
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-input-${color.id}-${idx}`}
                      className="custom-checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(color.id, idx)}
                    />
                    <label htmlFor={`checkbox-input-${color.id}-${idx}`}></label>
                    <p
                      className={`text-[20px] w-[150px] text-center text-white ${
                        item.checked ? "line-through" : ""
                      }`}
                    >
                      {item.text}
                    </p>
                    <TiDelete
                      className="cursor-pointer text-[22px] text-white"
                      onClick={() => removeItem(color.id, idx)}
                    />
                  </div>
                ))}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </>
  );
}

