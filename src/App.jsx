import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, Settings2, ChevronLeft, Type, 
  BookOpen, ScrollText, Search, Book, ChevronRight, 
  SkipBack, SkipForward, Menu, X 
} from 'lucide-react';

const MML_CONTENT = [
  // --- PART I: FOUNDATIONS ---
  { category: "Linear Algebra", title: "Systems of Linear Equations", content: "Linear equations are the most basic building blocks of linear algebra. A system of linear equations is a collection of one or more linear equations involving the same set of variables. In machine learning, we often represent these systems using matrices and vectors to find optimal solutions for model parameters." },
  { category: "Linear Algebra", title: "Matrices and Tensors", content: "Matrices are rectangular arrays of numbers that represent linear transformations. In higher dimensions, we use tensors. Tensors are a generalization of scalars, vectors, and matrices to higher orders. Understanding tensor operations is critical for deep learning frameworks like TensorFlow and PyTorch." },
  { category: "Linear Algebra", title: "Matrix Multiplication", content: "Matrix multiplication is not commutative, meaning AB does not necessarily equal BA. It represents the composition of linear transformations. The complexity of matrix multiplication is a central concern in training large neural networks where billions of parameters are updated simultaneously." },
  { category: "Linear Algebra", title: "Identity and Inverse Matrices", content: "The identity matrix acts as the 'one' in matrix algebra. An inverse matrix A-1, when multiplied by A, results in the identity matrix. Inverting a matrix is computationally expensive and is only possible if the matrix is square and non-singular (full rank)." },
  { category: "Linear Algebra", title: "Linear Independence", content: "A set of vectors is linearly independent if no vector in the set can be defined as a linear combination of the others. This concept is vital for understanding the dimensionality of a vector space and the concept of a basis." },
  { category: "Linear Algebra", title: "Basis and Dimension", content: "A basis is a set of linearly independent vectors that span a vector space. The number of vectors in a basis is the dimension of the space. In machine learning, we often seek to find a new basis (like in PCA) that represents data more efficiently." },
  { category: "Linear Algebra", title: "Rank of a Matrix", content: "The rank of a matrix is the maximum number of linearly independent rows or columns. It indicates the dimensions of the output space. Low-rank approximations are used in data compression and collaborative filtering." },
  
  { category: "Analytic Geometry", title: "Norms and Unit Vectors", content: "Norms measure the length or magnitude of a vector. The L2 norm (Euclidean) is most common, while the L1 norm (Manhattan) is used for sparsity and feature selection. Unit vectors have a norm of one and indicate direction without magnitude." },
  { category: "Analytic Geometry", title: "Inner Products", content: "The inner product (or dot product) allows us to define the concepts of length and angle in a vector space. It is the core operation in kernel methods and measuring similarity between data points in high-dimensional spaces." },
  { category: "Analytic Geometry", title: "Orthogonality", content: "Two vectors are orthogonal if their inner product is zero, meaning they are perpendicular. Orthogonal bases are preferred in numerical linear algebra because they provide stability and simplify computations." },
  { category: "Analytic Geometry", title: "Projections", content: "A projection maps a vector onto a subspace. In linear regression, we project the target vector onto the column space of the feature matrix. Understanding projections is key to understanding least squares optimization." },
  { category: "Analytic Geometry", title: "Rotations", content: "Rotations are linear transformations that preserve lengths and angles. They are represented by orthogonal matrices with a determinant of one. Rotations are used in data augmentation and coordinate transformations." },

  { category: "Matrix Decompositions", title: "Determinants and Trace", content: "The determinant describes how much a transformation scales volume, while the trace is the sum of diagonal elements. Both are invariant under basis changes and provide essential information about the properties of a matrix." },
  { category: "Matrix Decompositions", title: "Eigenvalues and Eigenvectors", content: "Eigenvectors are vectors whose direction remains unchanged by a linear transformation. Eigenvalues represent the scaling factor. These are fundamental for stability analysis and dimensionality reduction techniques like PCA." },
  { category: "Matrix Decompositions", title: "Cholesky Decomposition", content: "The Cholesky decomposition factors a symmetric, positive-definite matrix into the product of a lower triangular matrix and its transpose. it is twice as efficient as LU decomposition for solving linear equations." },
  { category: "Matrix Decompositions", title: "Singular Value Decomposition (SVD)", content: "SVD factors any matrix into three parts: two orthogonal matrices and a diagonal matrix of singular values. It is considered the 'Swiss Army Knife' of linear algebra, used for compression, noise reduction, and solving ill-posed problems." },

  { category: "Vector Calculus", title: "Partial Derivatives", content: "Partial derivatives measure how a function changes as one variable varies while others remain constant. They are the components of the gradient vector, which points in the direction of steepest ascent." },
  { category: "Vector Calculus", title: "The Gradient", content: "The gradient is a vector of partial derivatives. In machine learning, we use gradient descent to find the parameters that minimize a loss function by moving in the opposite direction of the gradient." },
  { category: "Vector Calculus", title: "Jacobian and Hessian", content: "The Jacobian is a matrix of first-order partial derivatives for vector-valued functions. The Hessian is a square matrix of second-order partial derivatives, describing the local curvature of a function's landscape." },
  { category: "Vector Calculus", title: "The Chain Rule", content: "The chain rule allows us to calculate the derivative of composite functions. It is the mathematical engine behind backpropagation, which is used to train deep neural networks." },
  { category: "Vector Calculus", title: "Taylor Series", content: "Taylor series provide a way to approximate complex functions using polynomials. Second-order Taylor approximations are used in optimization algorithms like Newton's Method." },

  { category: "Probability", title: "Bayes' Theorem", content: "Bayes' Theorem describes the probability of an event based on prior knowledge of conditions that might be related. It is the foundation of Bayesian inference, allowing us to update our beliefs as we observe new data." },
  { category: "Probability", title: "Expectation and Variance", content: "Expectation is the long-term average value of a random variable. Variance measures the spread or dispersion of the distribution. These statistics summarize the behavior of data models." },
  { category: "Probability", title: "Gaussian Distribution", content: "The Gaussian (or Normal) distribution is the most important distribution in statistics due to the Central Limit Theorem. Many machine learning algorithms assume errors are Gaussian distributed." },
  { category: "Probability", title: "Conjugate Priors", content: "In Bayesian statistics, a conjugate prior is a distribution that, when combined with a specific likelihood, results in a posterior distribution of the same family. This simplifies the math of updating probabilities." },

  // --- PART II: MACHINE LEARNING ---
  { category: "Optimization", title: "Gradient Descent", content: "Gradient descent is an iterative optimization algorithm for finding the minimum of a function. By taking steps proportional to the negative of the gradient, we can efficiently find optimal parameters for complex models." },
  { category: "Optimization", title: "Convexity", content: "A function is convex if any line segment between two points on the graph lies above or on the graph. Convex optimization is highly desirable because any local minimum is guaranteed to be a global minimum." },
  { category: "Optimization", title: "Lagrange Multipliers", content: "Lagrange multipliers are used to find the local maxima and minima of a function subject to equality constraints. They are central to the derivation of the Support Vector Machine (SVM) dual problem." },

  { category: "ML Algorithms", title: "The Bias-Variance Tradeoff", content: "Bias is the error from erroneous assumptions in the learning algorithm. Variance is the error from sensitivity to small fluctuations in the training set. We seek a balance to minimize total prediction error." },
  { category: "ML Algorithms", title: "Linear Regression", content: "Linear regression models the relationship between a scalar response and one or more explanatory variables. We use the principle of empirical risk minimization to find the line of best fit." },
  { category: "ML Algorithms", title: "Principal Component Analysis (PCA)", content: "PCA is a dimensionality reduction technique that transforms a large set of variables into a smaller one that still contains most of the information. It uses eigen-decomposition to find the directions of maximum variance." },
  { category: "ML Algorithms", title: "Support Vector Machines (SVM)", content: "SVMs find the hyperplane that maximizes the margin between two classes. The 'kernel trick' allows SVMs to perform non-linear classification by projecting data into higher-dimensional feature spaces." },
  { category: "ML Algorithms", title: "Gaussian Mixture Models (GMM)", content: "GMMs are a probabilistic model for representing normally distributed subpopulations within an overall population. They are used for soft-clustering and density estimation using the EM algorithm." },
  { category: "ML Algorithms", title: "The Kernel Trick", content: "The kernel trick allows us to compute inner products in high-dimensional spaces without explicitly transforming the data. This provides a computationally efficient way to learn non-linear decision boundaries." }
];

const App = () => {
  const [inputText, setInputText] = useState(MML_CONTENT[0].content);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isReadingMode, setIsReadingMode] = useState(false);
  
  // Reader State
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(350);
  const [chunkSize, setChunkSize] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Filter content based on search
  const filteredContent = useMemo(() => {
    return MML_CONTENT.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Core navigation logic
  const loadContent = (index) => {
    const safeIndex = (index + MML_CONTENT.length) % MML_CONTENT.length;
    setCurrentContentIndex(safeIndex);
    setInputText(MML_CONTENT[safeIndex].content);
    
    if (isReadingMode) {
      const parsedWords = MML_CONTENT[safeIndex].content.trim().split(/\s+/).filter(w => w.length > 0);
      setWords(parsedWords);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  const startReading = () => {
    const parsedWords = inputText.trim().split(/\s+/).filter(w => w.length > 0);
    if (parsedWords.length > 0) {
      setWords(parsedWords);
      setCurrentIndex(0);
      setIsPlaying(false);
      setIsReadingMode(true);
      setShowSettings(false);
    }
  };

  const goNextChapter = () => loadContent(currentContentIndex + 1);
  const goPrevChapter = () => loadContent(currentContentIndex - 1);

  // Consolidated Master Play/Pause/Replay Logic
  const handleMasterClick = () => {
    if (currentIndex >= words.length) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentIndex < words.length) {
      const currentChunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ');
      let delay = (60 / wpm) * 1000 * chunkSize;
      if (currentChunk.match(/[.,!?;:]$/)) delay *= 1.8;
      else if (currentChunk.length > 8) delay *= 1.2;

      timer = setTimeout(() => {
        setCurrentIndex(prev => prev + chunkSize);
      }, delay);
    } else if (currentIndex >= words.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, wpm, chunkSize, words]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isReadingMode) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { 
        e.preventDefault(); 
        handleMasterClick();
      }
      else if (e.code === 'ArrowLeft') { e.preventDefault(); setCurrentIndex(p => Math.max(0, p - (chunkSize * 5))); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); setCurrentIndex(p => Math.min(words.length - 1, p + (chunkSize * 5))); }
      else if (e.code === 'KeyR') { e.preventDefault(); setCurrentIndex(0); setIsPlaying(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadingMode, words.length, chunkSize, currentIndex, isPlaying]);

  const getProgressPercentage = () => words.length === 0 ? 0 : (currentIndex / words.length) * 100;

  const WordDisplay = () => {
    if (words.length === 0 || currentIndex >= words.length) {
      return (
        <div className="flex flex-col items-center justify-center h-48 animate-in fade-in duration-500">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Finished Section</p>
          <div className="flex items-center space-x-6">
             <button onClick={() => {setCurrentIndex(0); setIsPlaying(true);}} className="flex items-center space-x-2 text-gray-500 font-bold hover:text-black">
              <RotateCcw size={18} />
              <span>Retry</span>
            </button>
            <button onClick={goNextChapter} className="flex items-center space-x-2 text-slate-600 font-bold hover:underline">
              <span>Next Chapter</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      );
    }
    const chunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ');
    if (chunkSize > 1) {
      return (
        <div className="flex justify-center items-center h-48 w-full px-4">
          <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-800 text-center tracking-tighter leading-tight">
            {chunk}
          </span>
        </div>
      );
    }
    const midPoint = Math.ceil(chunk.length / 2) - 1;
    const left = chunk.slice(0, midPoint);
    const focus = chunk[midPoint];
    const right = chunk.slice(midPoint + 1);
    return (
      <div className="flex items-center h-48 w-full max-w-4xl mx-auto px-4">
        <div className="flex-1 text-right text-4xl sm:text-7xl md:text-8xl font-bold text-gray-700 tracking-tighter tabular-nums">
          {left}
        </div>
        <div className="text-4xl sm:text-7xl md:text-8xl font-bold text-red-500 tracking-tighter">
          {focus}
        </div>
        <div className="flex-1 text-left text-4xl sm:text-7xl md:text-8xl font-bold text-gray-700 tracking-tighter tabular-nums">
          {right}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans selection:bg-slate-200 flex overflow-hidden">
      
      {/* PERSISTENT DEDICATED LEFT PANE (LIBRARY) */}
      <div className={`${isSidebarOpen ? 'w-80 border-r' : 'w-0'} bg-white border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen overflow-hidden shrink-0 shadow-sm relative z-20`}>
        <div className="p-6 flex flex-col h-full w-80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-600 text-white rounded-lg shadow-lg">
                <BookOpen size={20} />
              </div>
              <h2 className="font-bold tracking-tight text-slate-800">Library</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-md lg:hidden">
              <X size={20} />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search concepts..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
            {filteredContent.map((item, idx) => {
              const originalIndex = MML_CONTENT.indexOf(item);
              return (
                <button
                  key={idx}
                  onClick={() => loadContent(originalIndex)}
                  className={`w-full text-left p-4 mb-2 rounded-xl transition-all group border ${currentContentIndex === originalIndex ? 'bg-slate-50 border-slate-200 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentContentIndex === originalIndex ? 'text-slate-600' : 'text-gray-400'}`}>{item.category}</span>
                  </div>
                  <h3 className={`text-sm font-bold ${currentContentIndex === originalIndex ? 'text-slate-900' : 'text-gray-800'}`}>{item.title}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen relative bg-[#fcfcfc]">
        
        {/* Toggle Sidebar Button (Float) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-6 left-6 z-30 p-3 bg-white border border-gray-200 shadow-xl rounded-xl hover:bg-gray-50 transition-all text-gray-600 active:scale-95"
          >
            <Menu size={24} />
          </button>
        )}

        {!isReadingMode ? (
          /* INPUT / EDITOR MODE */
          <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-8 py-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
                  <Type size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Flow Reader</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Professional Speed Trainer</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative flex flex-col">
              <textarea
                className="flex-1 w-full p-10 text-xl bg-white border border-gray-200 rounded-[32px] shadow-sm focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none resize-none transition-all placeholder:text-gray-300 leading-relaxed font-serif"
                placeholder="The core text for your speed reading practice will appear here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="absolute bottom-6 left-8 flex items-center space-x-4">
                <div className="flex items-center text-gray-400 space-x-2">
                  <ScrollText size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {inputText.trim().split(/\s+/).filter(w => w.length > 0).length} Words
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={startReading}
              disabled={!inputText.trim()}
              className="mt-8 w-full py-6 bg-black text-white rounded-2xl font-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center space-x-4 text-xl group"
            >
              <span>ENTER FOCUS MODE</span>
              <Play size={24} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* FOCUS / READING MODE */
          <div className="flex-1 flex flex-col h-full">
            {/* Header Controls */}
            <div className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
              <button
                onClick={() => { setIsPlaying(false); setIsReadingMode(false); }}
                className="px-4 py-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-all flex items-center space-x-2 font-bold text-sm uppercase tracking-widest"
              >
                <ChevronLeft size={20} />
                <span>Exit Focus</span>
              </button>

              <div className="flex items-center space-x-2 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{MML_CONTENT[currentContentIndex].category}</span>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-gray-700">{MML_CONTENT[currentContentIndex].title}</span>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-xl transition-all shadow-sm ${showSettings ? 'text-white bg-slate-600' : 'text-gray-500 bg-white border border-gray-100 hover:bg-gray-50'}`}
              >
                <Settings2 size={24} />
              </button>
            </div>

            {/* RSVP Word Stage */}
            <div className="flex-1 flex flex-col justify-center items-center relative">
              {chunkSize === 1 && currentIndex < words.length && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-px flex flex-col justify-between items-center pointer-events-none opacity-30">
                  <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                  <div className="w-1.5 h-4 bg-red-500 rounded-full" />
                </div>
              )}
              <WordDisplay />
            </div>

            {/* Settings HUD */}
            {showSettings && (
              <div className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-white border border-gray-100 p-8 rounded-[32px] shadow-2xl w-11/12 max-w-md z-50 animate-in fade-in slide-in-from-bottom-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reading Pace</label>
                      <span className="text-sm font-black text-slate-600">{wpm} WPM</span>
                    </div>
                    <input type="range" min="100" max="1000" step="25" value={wpm} onChange={(e) => setWpm(Number(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Chunk Size</label>
                      <span className="text-sm font-black text-slate-600">{chunkSize} {chunkSize === 1 ? 'Word' : 'Words'}</span>
                    </div>
                    <input type="range" min="1" max="3" step="1" value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Playback Navigation */}
            <div className="w-full max-w-4xl mx-auto px-8 pb-12">
              <div className="mb-10 group relative">
                <div className="h-4 bg-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all hover:h-6" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = (e.clientX - rect.left) / rect.width;
                  setCurrentIndex(Math.floor(percentage * words.length));
                }}>
                  <div className="absolute top-0 left-0 h-full bg-slate-600 rounded-full transition-all duration-150"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <span>Progress: {currentIndex} / {words.length} words</span>
                  <span>{Math.round(getProgressPercentage())}% Completed</span>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 sm:space-x-12">
                {/* Previous Chapter */}
                <button onClick={goPrevChapter} className="p-3 text-gray-300 hover:text-slate-600 transition-all active:scale-90" title="Previous Chapter">
                  <SkipBack size={24} />
                </button>
                
                {/* PRIMARY CONSOLIDATED BUTTON (Scaled Down) */}
                <button 
                  onClick={handleMasterClick}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                >
                  {currentIndex >= words.length ? (
                    <RotateCcw size={32} />
                  ) : isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                  ) : (
                    <Play size={32} fill="currentColor" className="ml-1" />
                  )}
                </button>

                {/* Next Chapter */}
                <button onClick={goNextChapter} className="p-3 text-gray-300 hover:text-slate-600 transition-all active:scale-90" title="Next Chapter">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;