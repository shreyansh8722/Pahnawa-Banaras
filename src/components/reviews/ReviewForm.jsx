import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, Camera, Loader2, X } from 'lucide-react';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  collection,
  doc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';

export const ReviewForm = ({
  spotId,
  user,
  onPostSuccess,
  isPosting,
  setIsPosting,
}) => {
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImageAndGetURL = (file) =>
    new Promise((resolve, reject) => {
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const path = `reviews/${spotId}/${filename}`;
      const sRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(sRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });

  const handleSubmitReview = async () => {
    if (!user || !newReviewText.trim()) return;

    setIsPosting(true);
    setUploadProgress(0);
    try {
      let imageUrl = null;
      if (selectedImageFile) {
        imageUrl = await uploadImageAndGetURL(selectedImageFile);
      }

      const reviewData = {
        spotId,
        userId: user.uid,
        username: user.displayName || user.email || 'Anonymous',
        userEmail: user.email,
        rating: newRating,
        comment: newReviewText.trim(),
        imageUrl: imageUrl || null,
        helpfulCount: 0,
        createdAt: serverTimestamp(),
      };

      const spotRef = doc(db, 'spots', spotId);
      const newReviewRef = doc(collection(db, 'reviews'));

      await runTransaction(db, async (transaction) => {
        const spotDoc = await transaction.get(spotRef);
        if (!spotDoc.exists()) throw 'Spot document does not exist!';
        const oldReviewCount = spotDoc.data().reviewCount || 0;
        const oldAverageRating = spotDoc.data().averageRating || 0;
        const newReviewCount = oldReviewCount + 1;
        const newAverageRating =
          (oldAverageRating * oldReviewCount + newRating) / newReviewCount;
        transaction.set(newReviewRef, reviewData);
        transaction.update(spotRef, {
          averageRating: parseFloat(newAverageRating.toFixed(1)),
          reviewCount: newReviewCount,
        });
      });

      setNewRating(5);
      setNewReviewText('');
      setSelectedImageFile(null);
      setUploadProgress(0);
      onPostSuccess(reviewData, newReviewRef.id);
    } catch (e) {
      console.error('Failed to post review:', e);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setNewRating(i + 1)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`w-6 h-6 ${
                i + 1 <= newRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {newRating} / 5
        </span>
      </div>

      <textarea
        rows={3}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3 bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
        placeholder="Share your experience..."
        value={newReviewText}
        onChange={(e) => setNewReviewText(e.target.value)}
      />

      {selectedImageFile && !isPosting && (
        <div className="mb-3 relative">
          <img
            src={URL.createObjectURL(selectedImageFile)}
            alt="preview"
            className="w-full h-44 object-cover rounded-lg"
          />
          <button
            onClick={() => setSelectedImageFile(null)}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isPosting && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
          <div
            className="bg-blue-600 h-1.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Camera className="w-5 h-5" /> Add Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                setSelectedImageFile(e.target.files[0]);
            }}
          />
        </label>

        <button
          onClick={handleSubmitReview}
          disabled={isPosting || !newReviewText.trim()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium w-28 disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isPosting ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </motion.div>
  );
};