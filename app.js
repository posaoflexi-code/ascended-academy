document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentStep = 1;
    const totalSteps = 4;

    // Quiz State
    let currentQuestionIndex = 0;
    const quizQuestions = [
        {
            question: "What is the primary goal of the 'Ascended' tone?",
            options: [
                "To sound robotic and professional",
                "To mirror energy and build trust",
                "To respond as fast as possible",
                "To use complex vocabulary"
            ],
            correct: 1
        },
        {
            question: "When a client expresses hesitation, you should:",
            options: [
                "Ignore it and push the price",
                "Validate their concern, then reframe",
                "End the conversation immediately",
                "Send a generic discount code"
            ],
            correct: 1
        },
        {
            question: "Which emoji usage is most appropriate for high-ticket sales?",
            options: [
                "🎉😎🔥 (Overuse)",
                "None at all (Strictly formal)",
                "Strategic matching of client's vibe",
                "Only money bags 💰"
            ],
            correct: 2
        }
    ];

    // Elements
    const steps = [
        null, // 0-index unused
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('course-view') // Pseudo-step 5
    ];

    const indicators = document.querySelectorAll('.step-indicator');
    const wizard = document.getElementById('wizard');
    const contentArea = document.querySelector('.content-area');

    // Navigation Function
    function goToStep(step) {
        // Handle hiding all steps
        steps.forEach(s => { if (s) s.classList.remove('active'); });

        // Show specific step
        if (steps[step]) {
            steps[step].classList.add('active');
            steps[step].classList.remove('hidden');
        }

        // Special UI mode for course view (Optional: widen the container)
        if (step === 5) {
            contentArea.classList.add('wide-mode');
            wizard.style.display = 'none'; // Hide wizard in course mode
        } else {
            contentArea.classList.remove('wide-mode');
            if (step <= 4) wizard.style.display = 'flex';
        }

        // Update indicators
        if (step <= 4) {
            indicators.forEach(ind => {
                const s = parseInt(ind.dataset.step);
                if (s < step) {
                    ind.classList.add('completed');
                    ind.classList.remove('active');
                } else if (s === step) {
                    ind.classList.add('active');
                    ind.classList.remove('completed');
                } else {
                    ind.classList.remove('active', 'completed');
                }
            });
        }

        window.scrollTo(0, 0);
    }

    // --- Step 1: Registration ---
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = registerForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Initializing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            goToStep(2);
        }, 800);
    });

    // --- Step 2: KYC Upload ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('id-upload');
    const uploadProgress = document.getElementById('upload-progress');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleUpload);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-color)';
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files.length) handleUpload();
    });

    function handleUpload() {
        dropZone.classList.add('hidden');
        uploadProgress.classList.remove('hidden');
        setTimeout(() => {
            goToStep(3);
        }, 2000);
    }

    // --- Step 3: NDA ---
    // --- Step 3: NDA ---
    const ndaDropZone = document.getElementById('nda-drop-zone');
    const ndaInput = document.getElementById('nda-upload');
    const ndaProgress = document.getElementById('nda-upload-progress');
    const ndaProgressBar = document.getElementById('nda-progress-bar');
    const ndaSuccess = document.getElementById('nda-success-msg');
    const submitNdaBtn = document.getElementById('submit-nda');
    const downloadBtn = document.getElementById('download-contract-btn');

    // PDF Download Handler
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const originalText = downloadBtn.innerText;
            downloadBtn.innerText = '⚙️ Generating PDF...';
            downloadBtn.disabled = true;

            try {
                // Fetch the contract template
                const response = await fetch('contract.html');
                const htmlText = await response.text();

                // Create a temporary container off-screen
                // We must append to body for styles/layout to compute, but hiding it from view
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.top = '0';
                container.style.width = '800px'; // Force width to match contract style
                container.innerHTML = htmlText;

                document.body.appendChild(container);

                // Options for PDF
                const opt = {
                    margin: 0.5,
                    filename: 'Ascended_Academy_NDA.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

                // Generate and save
                await html2pdf().set(opt).from(container).save();

                // Cleanup
                document.body.removeChild(container);

            } catch (err) {
                console.error('PDF Generation Error:', err);
                alert('Error generating PDF: ' + err.message);
            } finally {
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
            }
        });
    }

    ndaDropZone.addEventListener('click', () => ndaInput.click());

    ndaInput.addEventListener('change', () => {
        if (ndaInput.files.length) startNdaUpload();
    });

    ndaDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        ndaDropZone.style.borderColor = 'var(--accent-color)';
    });

    ndaDropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        ndaDropZone.style.borderColor = 'var(--border-color)';
    });

    ndaDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        ndaDropZone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files.length) startNdaUpload();
    });

    function startNdaUpload() {
        ndaDropZone.classList.add('hidden');
        ndaProgress.classList.remove('hidden');

        // Simulate upload progress
        setTimeout(() => { ndaProgressBar.style.width = '30%'; }, 100);
        setTimeout(() => { ndaProgressBar.style.width = '70%'; }, 800);
        setTimeout(() => {
            ndaProgressBar.style.width = '100%';
            setTimeout(() => {
                ndaProgress.classList.add('hidden');
                ndaSuccess.classList.remove('hidden');
                submitNdaBtn.disabled = false;
            }, 500);
        }, 1500);
    }

    submitNdaBtn.addEventListener('click', () => {
        goToStep(4);
    });

    // --- Dashboard & Course Logic ---
    const module1Card = document.getElementById('module-1-card');
    const backBtn = document.getElementById('back-to-dashboard');

    // Quiz Elements
    const quizCounter = document.getElementById('quiz-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const tracks = [
        document.querySelector('.course-step.filled'), // always filled initially
        document.getElementById('track-2'),
        document.getElementById('track-3')
    ];

    // Open Course View
    module1Card.addEventListener('click', () => {
        currentQuestionIndex = 0;
        loadQuestion(0);
        goToStep(5); // Show course view
    });

    // Back to Dashboard
    backBtn.addEventListener('click', () => {
        goToStep(4);
    });

    function loadQuestion(index) {
        if (index >= quizQuestions.length) {
            finishQuiz();
            return;
        }

        const q = quizQuestions[index];
        quizCounter.innerText = `Question ${index + 1} of ${quizQuestions.length}`;
        questionText.innerText = q.question;
        optionsContainer.innerHTML = '';

        // Remove any existing feedback/retry elements if they exist
        const existingFeedback = document.getElementById('quiz-feedback');
        if (existingFeedback) existingFeedback.remove();

        // Update top progress bars
        tracks.forEach((t, i) => {
            if (t) {
                if (i <= index) t.classList.add('filled');
                else t.classList.remove('filled');
            }
        });

        q.options.forEach((opt, i) => {
            const btn = document.createElement('div');
            btn.className = 'quiz-option-btn';
            btn.innerText = opt;
            btn.dataset.index = i; // Store index for retrieval
            btn.addEventListener('click', () => handleAnswer(i, q.correct, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(selectedIndex, correctIndex, btnElement) {
        // Prevent multiple clicks
        const allOpts = optionsContainer.querySelectorAll('.quiz-option-btn');
        allOpts.forEach(b => b.style.pointerEvents = 'none');

        if (selectedIndex === correctIndex) {
            btnElement.classList.add('selected-correct');
            // Show brief success msg or just move on? User said "answer all properly".
            // We'll move on automatically if correct.
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            }, 1000);
        } else {
            btnElement.classList.add('selected-wrong');

            // Show Feedback & Retry Button
            showFeedback(false);
        }
    }

    function showFeedback(isCorrect) {
        let feedbackEl = document.getElementById('quiz-feedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('div');
            feedbackEl.id = 'quiz-feedback';
            feedbackEl.style.marginTop = '1.5rem';
            feedbackEl.style.textAlign = 'center';
            feedbackEl.style.animation = 'fadeScale 0.3s ease';
            document.getElementById('quiz-content').appendChild(feedbackEl);
        }

        if (!isCorrect) {
            feedbackEl.innerHTML = `
                <div style="color: #ef4444; font-weight: 700; margin-bottom: 0.5rem;">❌ Incorrect Answer</div>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #ccc;">Review the material and try again.</p>
                <button id="retry-btn" class="btn-primary" style="padding: 10px 20px; font-size: 0.9rem; width: auto;">Retry Question</button>
            `;

            document.getElementById('retry-btn').addEventListener('click', resetCurrentQuestion);
        }
    }

    function resetCurrentQuestion() {
        // Remove feedback
        const feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) feedbackEl.remove();

        // Reset options state
        const allOpts = optionsContainer.querySelectorAll('.quiz-option-btn');
        allOpts.forEach(b => {
            b.classList.remove('selected-wrong');
            b.style.pointerEvents = 'auto'; // Re-enable clicking
        });
    }

    function finishQuiz() {
        optionsContainer.innerHTML = '<div style="text-align:center; padding: 2rem;"><h3>🎉 Module Completed!</h3><p>Return to dashboard to see your progress.</p></div>';
        questionText.innerText = "Congratulations!";
        quizCounter.innerText = "COMPLETED";

        // Remove feedback if present
        const feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) feedbackEl.remove();

        // Mark Dashboard as updated
        const overallProgressBar = document.getElementById('overall-progress');
        const progVal = document.getElementById('prog-val');

        overallProgressBar.style.width = '11%';
        progVal.innerText = '11%';

        const badge = module1Card.querySelector('.status-badge');
        badge.innerText = 'Completed';
        badge.style.background = '#22c55e';
        badge.style.color = '#fff';

        // Auto back after 2 seconds?
        setTimeout(() => {
            optionsContainer.innerHTML += '<button class="btn-primary" style="margin-top:1rem" onclick="document.getElementById(\'back-to-dashboard\').click()">Back to Dashboard</button>';
        }, 500);
    }
});
