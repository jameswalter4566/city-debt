// City Debt - Enrollment Funnel Application
// Handles screen navigation, video playback, and user interactions

class EnrollmentFunnel {
    constructor() {
        this.currentScreen = 1;
        this.totalScreens = 5;
        this.videoWatched = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen(1);
        this.initFloatingAvatar();
    }

    bindEvents() {
        // Next buttons
        document.querySelectorAll('[id^="next-btn-"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenNum = parseInt(btn.id.split('-').pop());
                this.nextScreen(screenNum);
            });
        });

        // Main video play button
        const playBtn = document.getElementById('play-btn');
        const videoOverlay = document.getElementById('video-overlay');
        const introVideo = document.getElementById('intro-video');

        if (playBtn && introVideo) {
            playBtn.addEventListener('click', () => {
                this.playMainVideo();
            });

            videoOverlay.addEventListener('click', () => {
                this.playMainVideo();
            });

            introVideo.addEventListener('ended', () => {
                this.onVideoEnded(1);
            });

            introVideo.addEventListener('timeupdate', () => {
                this.updateVideoProgress(introVideo);
            });
        }

        // Floating avatar
        const avatarOverlay = document.getElementById('avatar-overlay');
        const avatarVideo = document.getElementById('avatar-video');
        const avatarClose = document.getElementById('avatar-close');

        if (avatarOverlay && avatarVideo) {
            avatarOverlay.addEventListener('click', () => {
                this.playAvatarVideo();
            });

            avatarClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideFloatingAvatar();
            });
        }
    }

    showScreen(screenNum) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenNum}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenNum;
            this.updateProgress(screenNum);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    nextScreen(fromScreen) {
        const nextScreenNum = fromScreen + 1;
        if (nextScreenNum <= this.totalScreens) {
            this.showScreen(nextScreenNum);
        } else {
            // Final screen - redirect or show completion
            this.onFunnelComplete();
        }
    }

    updateProgress(screenNum) {
        const steps = document.querySelectorAll('.step');
        const connectors = document.querySelectorAll('.step-connector');

        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('completed', 'active');

            if (stepNum < screenNum) {
                step.classList.add('completed');
            } else if (stepNum === screenNum) {
                step.classList.add('active');
            }
        });

        // Update connectors
        connectors.forEach((connector, index) => {
            if (index < screenNum - 1) {
                connector.style.background = 'var(--primary-blue)';
            } else {
                connector.style.background = 'var(--border-color)';
            }
        });
    }

    playMainVideo() {
        const video = document.getElementById('intro-video');
        const overlay = document.getElementById('video-overlay');

        if (video && overlay) {
            overlay.classList.add('hidden');
            video.play();
        }
    }

    updateVideoProgress(video) {
        const progress = (video.currentTime / video.duration) * 100;

        // Enable next button when video is 80% complete
        if (progress >= 80) {
            this.enableNextButton(1);
        }
    }

    onVideoEnded(screenNum) {
        this.videoWatched[screenNum] = true;
        this.enableNextButton(screenNum);
    }

    enableNextButton(screenNum) {
        const btn = document.getElementById(`next-btn-${screenNum}`);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.innerHTML = `
                Next
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
            `;
        }
    }

    initFloatingAvatar() {
        const avatar = document.getElementById('floating-avatar');
        const avatarVideo = document.getElementById('avatar-video');

        // For demo, auto-play avatar after delay
        setTimeout(() => {
            if (avatar) {
                avatar.style.display = 'block';
            }
        }, 2000);
    }

    playAvatarVideo() {
        const video = document.getElementById('avatar-video');
        const overlay = document.getElementById('avatar-overlay');

        if (video && overlay) {
            overlay.classList.add('hidden');
            video.muted = false;
            video.play();
        }
    }

    hideFloatingAvatar() {
        const avatar = document.getElementById('floating-avatar');
        if (avatar) {
            avatar.style.display = 'none';
        }
    }

    onFunnelComplete() {
        // Handle funnel completion
        console.log('Funnel completed!');
        // Could redirect to success page or show completion modal
        alert('Congratulations! You have completed the enrollment process.');
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatPercent(value) {
    return `${value}%`;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.enrollmentFunnel = new EnrollmentFunnel();

    // For demo purposes, enable buttons without video requirement
    // Remove this in production
    setTimeout(() => {
        document.querySelectorAll('.primary-btn.disabled').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.textContent = 'Next';
        });
    }, 1000);
});

// Simulate captions for floating avatar
const avatarCaptions = [
    "which includes your total debt that we can assist",
    "with your monthly minimum payment",
    "by not being in debt, not to mention all the stress",
    "to make sure you're a hundred percent clear on every aspect",
    "and we'll use that money to negotiate with your creditors"
];

let captionIndex = 0;
function updateAvatarCaption() {
    const caption = document.getElementById('avatar-caption');
    if (caption) {
        caption.textContent = avatarCaptions[captionIndex];
        captionIndex = (captionIndex + 1) % avatarCaptions.length;
    }
}

// Update caption every 3 seconds during video playback
setInterval(updateAvatarCaption, 3000);
