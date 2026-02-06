// City Debt Apply Funnel JavaScript

// Form handling for step 1 (landing page)
document.addEventListener('DOMContentLoaded', function() {
    // Step 1 form - Debt amount selection
    const step1Form = document.getElementById('step1-form');
    if (step1Form) {
        step1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            const debtAmount = document.getElementById('debt-amount').value;
            if (debtAmount) {
                localStorage.setItem('debtAmount', debtAmount);
                window.location.href = 'apply-step1.html';
            }
        });
    }

    // Contact form (step 1 of 2)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;

            // Store in localStorage
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('phone', phone);
            localStorage.setItem('email', email);

            // Navigate to next step
            window.location.href = 'apply-step2.html';
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = '(' + value;
                    } else if (value.length <= 6) {
                        value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
                    } else {
                        value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
                    }
                }
                e.target.value = value;
            });
        }
    }

    // Address form (final step)
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const address = document.getElementById('address').value;
            const spanish = document.getElementById('spanish').checked;

            // Store in localStorage
            localStorage.setItem('address', address);
            localStorage.setItem('spanish', spanish);

            // Get stored data for query params
            const firstName = localStorage.getItem('firstName') || '';
            const debtAmount = localStorage.getItem('debtAmount') || '20000';

            // Navigate to quote page
            window.location.href = `quote.html?firstName=${encodeURIComponent(firstName)}&debt=${debtAmount}`;
        });
    }

    // Floating label animation
    const floatingInputs = document.querySelectorAll('.floating-label .form-input');
    floatingInputs.forEach(input => {
        // Check initial state
        if (input.value) {
            input.classList.add('has-value');
        }

        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Accessibility button
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', function() {
            // Toggle high contrast mode or open accessibility menu
            document.body.classList.toggle('high-contrast');
        });
    }
});

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Google Places Autocomplete initialization (if API key is provided)
function initAutocomplete() {
    const addressInput = document.getElementById('address');
    if (addressInput && typeof google !== 'undefined') {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            if (place.address_components) {
                // Parse address components
                let street = '';
                let city = '';
                let state = '';
                let zip = '';

                place.address_components.forEach(component => {
                    const types = component.types;
                    if (types.includes('street_number')) {
                        street = component.long_name + ' ';
                    }
                    if (types.includes('route')) {
                        street += component.long_name;
                    }
                    if (types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        state = component.short_name;
                    }
                    if (types.includes('postal_code')) {
                        zip = component.long_name;
                    }
                });

                // Store parsed address
                localStorage.setItem('street', street);
                localStorage.setItem('city', city);
                localStorage.setItem('state', state);
                localStorage.setItem('zip', zip);
            }
        });
    }
}

// Call init if Google Maps is loaded
if (typeof google !== 'undefined') {
    google.maps.event.addDomListener(window, 'load', initAutocomplete);
}
