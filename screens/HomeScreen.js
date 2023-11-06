import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import Amplify from "aws-amplify";
import { API } from "aws-amplify";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editedText, setEditedText] = useState(""); // State to track edited text
  const [editingTaskId, setEditingTaskId] = useState(null); // State to track which task is being edited
  const [isEditingModalVisible, setEditingModalVisible] = useState(false); // State to control modal visibilitycl
  const [editedDate, setEditedDate] = useState(new Date());

  useEffect(() => {
    // Load tasks from storage when the component mounts
    Modal.setAppElement("#root");
    loadTasks();
  }, []);

  const loadTasks = async () => {
    // Load tasks from AsyncStorage (or any other storage mechanism you prefer)
    // Update the tasks state with the loaded tasks
    // For now, we'll initialize it with sample data
    setTasks([
      // Add more tasks as neededd
    ]);
  };

  const saveTasks = async () => {
    // Save tasks to AsyncStorage (or any other storage mechanism you prefer)
    // For now, we'll just log the updated tasks to the console
    console.log("Updated Tasks:", tasks);
  };

  /* async function addTaskViaLambda(newTask) {
    try {
      const result = await API.post("myfirstFunction", "/add-task", {
        body: JSON.stringify(newTask),
      });
      console.log("Lambda function response:", result);
      return result; // Return the result if needed
    } catch (error) {
      console.error("Error invoking Lambda function for adding task:", error);
      throw error; // Rethrow the error for error handling in the calling code
    }
  }

  async function deleteTaskViaLambda(taskId) {
    const requestBody = {
      id: taskId,
    };
    try {
      const result = await API.post("myfirstFunction", "/delete-task", {
        body: JSON.stringify(requestBody),
      });
      console.log("Lambda function response:", result);
      return result; // Return the result if needed
    } catch (error) {
      console.error("Error invoking Lambda function for deleting task:", error);
      throw error; // Rethrow the error for error handling in the calling code
    }
  }

  async function editTaskViaLambda(editedTask) {
    try {
      const result = await API.put("myfirstFunction", "/edit-task", {
        body: JSON.stringify(editedTask),
      });
      console.log("Lambda function response:", result);
      return result; // Return the result if needed
    } catch (error) {
      console.error("Error invoking Lambda function for editing task:", error);
      throw error; // Rethrow the error for error handling in the calling code
    }
  }*/

  const addTask = async () => {
    if (taskText.trim() === "") {
      return;
    }

    const newTask = {
      id: new Date().getTime(),
      text: taskText,
      date: selectedDate, // Include the selected date
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setSelectedDate(new Date()); // Reset the selected date to the current date
    saveTasks();

    try {
      const response = await fetch(
        "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users", // Replace with the actual URL of your API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        // Task edited successfully
        // Refresh the tasks list or take appropriate action
      } else {
        // Handle error
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    // Delete a task from the tasks state by ID
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    // Save the updated tasks list
    setTasks(updatedTasks);
    saveTasks();

    try {
      const response = await fetch(
        "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users", // Replace with the actual URL of your API
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Task edited successfully
        // Refresh the tasks list or take appropriate action
      } else {
        // Handle error
        console.error("Error editing task:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleEditTask = async () => {
    if (editingTaskId !== null) {
      // Find the task being edited
      const editedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );

      if (editedTaskIndex !== -1) {
        // Update the text of the task at the found index

        const updatedTasks = [...tasks];
        updatedTasks[editedTaskIndex].text = editedText;
        updatedTasks[editedTaskIndex].date = editedDate;
        // Save the updated tasks list to storage (e.g., AsyncStorage)
        setTasks(updatedTasks);
        saveTasks();
        /* try {
          const response = await editTaskViaLambda(
            updatedTasks[editedTaskIndex]
          );

          if (response.statusCode === 200) {
            // Task edited successfully
            // You can handle success here if needed
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }*/
        try {
          const response = await fetch(
            "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users", // Replace with the actual URL of your API
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedTasks[editedTaskIndex]),
            }
          );

          if (response.ok) {
            // Task edited successfully
            // Refresh the tasks list or take appropriate action
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }
        // Clear the editing state
        setEditingTaskId(null);
        setEditedText("");
        setEditedDate(new Date()); // Reset the edited date
        setEditingModalVisible(false); // Close the editing modal

        /* try {
          const response = await fetch(
            "https://6zhixrkatj.execute-api.us-east-1.amazonaws.com/edit",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editedTask),
            }
          );

          if (response.ok) {
            // Task edited successfully
            // Refresh the tasks list or take appropriate action
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }*/
      }
    }
  };

  return (
    <View>
      <h4>Enter Task :</h4>
      <TextInput
        placeholder="Task Text"
        value={taskText}
        onChangeText={(text) => setTaskText(text)}
      />
      <h4></h4>
      {/* Add a DatePickerIOS component */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Select Date"
        dateFormat="yyyy-MM-dd"
      />

      <Button title="Add Task" onPress={addTask}>
        Add Task
      </Button>

      {tasks.map((task) => (
        <View key={task.id}>
          <Text>{task.text}</Text>
          <Text>Date: {task.date.toDateString()}</Text>
          <Pressable
            onPress={() => {
              setEditingTaskId(task.id); // Set the ID of the task being edited
              setEditedText(task.text); // Initialize the edited text with the current task text
              setEditingModalVisible(true); // Open the editing modal
            }}
          >
            <Text>Edit</Text>
          </Pressable>
          <Pressable onPress={() => deleteTask(task.id)}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      ))}

      {/* Editing modal */}
      <Modal
        isOpen={isEditingModalVisible}
        onRequestClose={() => {
          setEditingModalVisible(false);
          setEditedText(""); // Clear edited text when closing modal
        }}
      >
        <TextInput
          placeholder="Edit Task Text"
          value={editedText}
          onChangeText={(text) => setEditedText(text)}
        />
        <DatePicker
          selected={editedDate}
          onChange={(date) => setEditedDate(date)}
          placeholderText="Select Date"
          dateFormat="yyyy-MM-dd"
        />
        <Button title="Save" onPress={handleEditTask}>
          Save
        </Button>
      </Modal>
    </View>
  );
};

export default HomeScreen;
