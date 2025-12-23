// snow-effect.js - Effetto neve con particles.js
(function() {
    // Attendi che il DOM sia caricato
    document.addEventListener('DOMContentLoaded', function() {
        
        // Controlla se l'utente ha disattivato la neve
        const snowDisabled = localStorage.getItem('snowDisabled') === 'true';
        
        // Crea il contenitore per le particelle
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        document.body.appendChild(snowContainer);
        
        // Crea il pulsante toggle
        const toggleButton = document.createElement('button');
        toggleButton.id = 'snow-toggle';
        toggleButton.innerHTML = '❄️';
        toggleButton.title = 'Attiva/Disattiva effetto neve';
        document.body.appendChild(toggleButton);
        
        // Carica particles.js dinamicamente
        function loadParticlesJS() {
            return new Promise((resolve, reject) => {
                if (window.particlesJS) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        // Inizializza l'effetto neve
        async function initSnow() {
            try {
                await loadParticlesJS();
                
                // Configurazione particelle neve
                particlesJS('snow-container', {
                    particles: {
                        number: {
                            value: 80,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#ffffff"
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000"
                            }
                        },
                        opacity: {
                            value: 0.8,
                            random: true,
                            anim: {
                                enable: false
                            }
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: {
                                enable: false
                            }
                        },
                        line_linked: {
                            enable: false
                        },
                        move: {
                            enable: true,
                            speed: 1.5,
                            direction: "bottom",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                            attract: {
                                enable: false
                            }
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: false
                            },
                            onclick: {
                                enable: false
                            },
                            resize: true
                        }
                    },
                    retina_detect: true
                });
                
                // Applica stili CSS
                const style = document.createElement('style');
                style.textContent = `
                    #snow-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 9998;
                    }
                    
                    #snow-toggle {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    }
                    
                    #snow-toggle:hover {
                        background: rgba(229, 9, 20, 0.8);
                        transform: scale(1.1);
                    }
                    
                    #snow-toggle.active {
                        background: rgba(229, 9, 20, 0.9);
                    }
                    
                    /* Ottimizzazione per dispositivi mobili */
                    @media (max-width: 768px) {
                        #snow-container {
                            display: none; /* Disattiva su mobile per performance */
                        }
                        #snow-toggle {
                            display: none;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                // Imposta stato iniziale
                if (snowDisabled) {
                    snowContainer.style.display = 'none';
                    toggleButton.classList.remove('active');
                } else {
                    snowContainer.style.display = 'block';
                    toggleButton.classList.add('active');
                }
                
            } catch (error) {
                console.error('Errore nel caricamento della neve:', error);
                // Fallback con CSS semplice
                createFallbackSnow();
            }
        }
        
        // Fallback CSS per se particles.js fallisce
        function createFallbackSnow() {
            const fallbackStyle = document.createElement('style');
            fallbackStyle.textContent = `
                .fallback-snowflake {
                    position: fixed;
                    top: -10px;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    animation: fall linear infinite;
                }
                
                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(fallbackStyle);
            
            // Crea 50 fiocchi di fallback
            for (let i = 0; i < 50; i++) {
                const flake = document.createElement('div');
                flake.className = 'fallback-snowflake';
                flake.style.left = Math.random() * 100 + 'vw';
                flake.style.width = flake.style.height = (Math.random() * 4 + 2) + 'px';
                flake.style.opacity = Math.random() * 0.5 + 0.3;
                flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
                flake.style.animationDelay = Math.random() * 10 + 's';
                document.body.appendChild(flake);
            }
        }
        
        // Gestione toggle
        toggleButton.addEventListener('click', function() {
            const isActive = toggleButton.classList.contains('active');
            
            if (isActive) {
                // Disattiva
                snowContainer.style.display = 'none';
                toggleButton.classList.remove('active');
                localStorage.setItem('snowDisabled', 'true');
            } else {
                // Attiva
                snowContainer.style.display = 'block';
                toggleButton.classList.add('active');
                localStorage.setItem('snowDisabled', 'false');
            }
        });
        
        // Inizializza l'effetto neve
        if (!snowDisabled) {
            initSnow();
        }
        
        // Ottimizzazione per mobile
        if (window.innerWidth <= 768) {
            snowContainer.style.display = 'none';
            toggleButton.style.display = 'none';
        }
        
    });
})();
