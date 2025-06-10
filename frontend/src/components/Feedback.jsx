import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes } from 'react-icons/fa';

const Feedback = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Google Form IDs
    const FORM_ID = '1FAIpQLSdWsntEnon24BvSTl0nnhH62l0hagny-y8Uho4PMHrjstfsRA';
    const RATING_FIELD_ID = 'entry.1331305691';
    const COMMENT_FIELD_ID = 'entry.973832084';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Create form data
            const formData = new FormData();
            formData.append(RATING_FIELD_ID, rating);
            formData.append(COMMENT_FIELD_ID, comment);

            console.log('Submitting feedback:', {
                rating,
                comment,
                formUrl: `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`
            });

            // Submit to Google Form
            const response = await fetch(
                `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`,
                {
                    method: 'POST',
                    mode: 'no-cors', // Required for Google Forms
                    body: formData
                }
            );

            console.log('Form submission response:', response);

            // Since we're using no-cors, we can't check the response status
            // But we can assume it worked if no error was thrown
            setSubmitStatus('success');
            setRating(0);
            setComment('');
            
            // Close modal after 2 seconds
            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-white hover:text-[#3498db] transition-colors duration-300 flex items-center gap-2"
            >
                <FaStar className="text-lg" />
                <span>Feedback</span>
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Share Your Feedback</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        How would you rate your experience?
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="text-2xl focus:outline-none"
                                            >
                                                <FaStar
                                                    className={`${
                                                        star <= rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="comment"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Additional Comments
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                        placeholder="Tell us more about your experience..."
                                    />
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="text-green-600 text-sm">
                                        Thank you for your feedback!
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="text-red-600 text-sm">
                                        There was an error submitting your feedback. Please try again.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || rating === 0}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                        isSubmitting || rating === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Feedback;