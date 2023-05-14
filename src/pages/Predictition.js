import { UserAuth } from "../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import * as tf from '@tensorflow/tfjs';
import { loadLayersModel } from '@tensorflow/tfjs';
import MapPredict from "./MapPredict";
import React, { useEffect, useState } from "react";
// Labels
const Result = {
    0: "Aerosol",
    1: "Battery",
    2: "Cardboard",
    3: "Food can",
    4: "Glass bottle",
    5: "Ink cartridge",
    6: "Magazine",
    7: "Paper bag",
    8: "Plastic bag",
    9: "Plastic bottle",
    10: "Plastic utensils",
    11: "Soda can"
};

// Model URL
const url = {
    model: 'https://raw.githubusercontent.com/hexbacon/Model/main/model.json',
};


let model;
let label;

// Helper funciton to load mode
const loadModel = async () => {
    try {
        model = await loadLayersModel(url.model);
    } catch (error) {
        console.log(error);
        return;
    }
    if (model && model.predict) {
        console.log('Model is loaded and has predict method!');
    }
}
const drawBoundingBox = (image, box, label) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
  
    // Draw the bounding box
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(box[0], box[1], box[2], box[3]);
  
    // Draw the label at the center of the bounding box
    ctx.fillStyle = "red";
    ctx.font = "14px Arial";
    ctx.fillText(label, box[0] + box[2] / 2, box[1] + box[3] / 2);
  
    return canvas.toDataURL();
  };

  async function preprocessImage(image) {
    // Resize the input image to the expected size (224, 224)
    const resized = tf.image.resizeBilinear(tf.cast(image, 'float32'), [224, 224]);
  
    // Normalize the pixel values to be between -1 and 1
    const offset = tf.scalar(127.5);
    const normalized = resized.sub(offset).div(offset);
  
    // Add a batch dimension and return the preprocessed image tensor
    return normalized.expandDims();
  }
  
  const Prediction = () => {
    const [predictionComplete, setPredictionComplete] = useState(false);
    const { user, logout } = UserAuth();
    const navigate = useNavigate();
  
    const handleLogOut = async () => {
      try {
        await logout();
        navigate('/');
        console.log("You are logged out!");
      } catch (error) {
        console.log(error)
      }
    }
  
    const [model, setModel] = useState(null);
  
    useEffect(() => {
      const loadModel = async () => {
        try {
          const model = await loadLayersModel(url.model);
          setModel(model);
        } catch (error) {
          console.log(error);
        }
      };
  
      loadModel();
    }, []);
  
    const PerformPrediction = async () => {
      // Check if model is loaded
      if (!model) {
        console.log("Model not loaded");
        return;
      }
      // Start processing image
      const image = document.getElementById("selected-image");
      const preImage = await preprocessImage(image);
      // Start Predicting
      try {
        const predictResult = await model.executeAsync(preImage);
        const predictOutput = await predictResult.data();
  
        const boundingBox = predictOutput.slice(0, 4);
        const classProbs = predictOutput.slice(4);
  
        const order = Array.from(predictOutput)
          .map((p, i) => {
            return {
              probability: p,
              className: Result[i]
            };
          })
          .sort((first, second) => {
            return second.probability - first.probability;
          })
          .slice(0, 1);
        const label = order[0].className;
        const dataURL = drawBoundingBox(image, boundingBox, label);
        document.getElementById("selected-image").setAttribute("src", dataURL);
        setPredictionComplete(true);
      } catch (error) {
        console.log(error);
      }
    }
  
    const ImageHandler = () => {
      let reader = new FileReader();
      reader.onload = function () {
        let dataURL = reader.result;
        document.getElementById("selected-image").setAttribute("src", dataURL);
        let predictionList = document.getElementById("prediction-list");
        // If the list is not empty, clear it
        if (predictionList) {
          predictionList.innerHTML = "";
        }
      };
      // Read the image
      let file = document.getElementById("image-selector").files[0];
      reader.readAsDataURL(file);
    }
    return (
        <>
            <h1>Welcome</h1>
            <p>User Email: {user && user.email}</p>
            <div className="input-container form">
                <div className="file-input form__input">
                    <input type="file" id="image-selector" accept="image/*" onChange={ImageHandler} />
                </div>
                <div className="button-input form__input">
                    <button id="predictBtn" onClick={PerformPrediction}>Predict</button>
                </div>
            </div>
            <div className="results">
                <div className="result-in">
                    <div className="result-image">
                        <h2>Image</h2>
                        <img id="selected-image" className="ml-3" width="250" alt="" />
                    </div>
                    <div className="result-list">
                        <ol id="list"></ol>
                    </div>
                </div>
            </div>
            <button onClick={handleLogOut}>LogOut</button>
            {predictionComplete && <MapPredict item={label} />}
        </>
    )
}

export default Prediction;