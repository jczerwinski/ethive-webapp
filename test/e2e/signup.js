describe('/signup', function() {
	beforeEach(function () {
		browser.get('https://localhost:9000/signup');
	});
	it('has a good title', function() {
		expect(browser.getTitle()).toBe('Sign Up for Ethive');
	});
	describe('username', function() {
		it('has a username field', function() {
			expect(element(by.model('newUser.username')).isPresent()).toBe(true);
		});
		it('is required', function() {
			expect(element(by.model('newUser.username')).getAttribute('required')).toBe('true');
		});
		it('must not be an existing username, or shows an error', function() {
			var input = element(by.model('newUser.username'));
			input.sendKeys('jczerwinski');
			expect(input.getAttribute('class')).toMatch('ng-invalid-unavailable-username');
		});
		it('must have from 3 to 20 alphanumeric, period, or underscore characters, or shows an error', function() {
			var input = element(by.model('newUser.username'));
			input.sendKeys('a');
			// One character is not enough
			expect(input.getAttribute('class')).toMatch('ng-invalid-username');
			input.sendKeys('b');
			// Two are not enough
			expect(input.getAttribute('class')).toMatch('ng-invalid-username');
			input.sendKeys('cdefghijklmnopqrstu');
			// 21 are too many.
			expect(input.getAttribute('class')).toMatch('ng-invalid-username');
			input.clear();
			input.sendKeys('1234567890_.');
			expect(input.getAttribute('class')).toMatch('ng-valid');
			input.clear();
			input.sendKeys('#%*)');
			expect(input.getAttribute('class')).toMatch('ng-invalid-username');
		});
		it('shows success when valid', function() {
			expect(element(by.model('newUser.username')).sendKeys('validUsername').getAttribute('class')).toMatch('ng-valid');
		});
	});
	describe('email', function() {
		it('has an email field', function() {
			expect(element(by.model('newUser.email')).isPresent()).toBe(true);
		});
		it('is required', function() {
			expect(element(by.model('newUser.email')).getAttribute('required')).toBe('true');
		});
		it('must be a valid email, or shows an error', function() {
			var email = element(by.model('newUser.email'));
			// Keep it simple... will also be validated via return email, so no need to go crazy here.
			expect(email.sendKeys('a@').getAttribute('class')).toMatch('ng-invalid-email');
			email.clear();
			expect(email.sendKeys('@o').getAttribute('class')).toMatch('ng-invalid-email');
			email.clear();
			expect(email.sendKeys('@').getAttribute('class')).toMatch('ng-invalid-email');
		});
		it('must not be an existing email, or shows an error', function() {
			var email = element(by.model('newUser.email'));
			expect(email.sendKeys('jamie.czerwinski@gmail.com').getAttribute('class')).toMatch('ng-invalid-unavailable-email');
		});
		it('shows success when valid', function() {
			var email = element(by.model('newUser.email'));
			expect(email.sendKeys('a@e').getAttribute('class')).toMatch('ng-valid');
		});
	});
	describe('password', function() {
		it('has a password field', function() {
			expect(element(by.model('newUser.password')).isPresent()).toBe(true);
		});
		it('is required', function() {
			expect(element(by.model('newUser.password')).getAttribute('required')).toBe('true');
		});
		it('must have from 8 to 100 alphanumeric, period, or underscore characters, or shows an error', function() {
			var password = element(by.model('newUser.password'));
			expect(password.sendKeys('1').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('2').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('3').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('4').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('5').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('6').getAttribute('class')).toMatch('ng-invalid-password');
			expect(password.sendKeys('7').getAttribute('class')).toMatch('ng-invalid-password');			
			// Alphanumeric, underscores, and periods OK.
			password.sendKeys('1234567890_.aA');
			expect(password.getAttribute('class')).toMatch('ng-valid');
			password.clear();
			// Special characters not OK
			password.sendKeys('#%*)');
			expect(password.getAttribute('class')).toMatch('ng-invalid');
			// 101 Characters not OK
			password.clear();
			password.sendKeys('aoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeua');
			expect(password.getAttribute('class')).toMatch('ng-invalid');
		});
		it('shows success when valid', function() {
			var password = element(by.model('newUser.password'));
			expect(password.sendKeys('12345678').getAttribute('class')).toMatch('ng-valid');
		});
	});
	describe('repeat password', function() {
		it('has a repeat password field', function() {
			var password = element(by.id('repeatPassword'));
			expect(password.isPresent()).toBe(true);
		});
		it('is required', function() {
			var password = element(by.id('repeatPassword'));
			expect(password.getAttribute('required')).toBe('true');
		});
		it('must equal the password field, or shows an error', function() {
			var repeatPassword = element(by.id('repeatPassword'));
			var password = element(by.model('newUser.password'));
			password.sendKeys('testeaoeu');
			repeatPassword.sendKeys('failtest');
			expect(repeatPassword.getAttribute('class')).toMatch('ng-invalid');
		});
		it('shows success when equals the password field', function() {
			var repeatPassword = element(by.id('repeatPassword'));
			var password = element(by.model('newUser.password'));
			password.sendKeys('testtest');
			repeatPassword.sendKeys('testtest');
			expect(repeatPassword.getAttribute('class')).toMatch('ng-valid');
		});
	});
	ddescribe('submit', function() {
		it('has a submit button', function() {
			var submit = element(by.id('submit'));
			expect(submit.isPresent()).toBe(true);
		});
		it('is disabled if any field is invalid', function() {
			var submit = element(by.id('submit'));
			expect(submit.getAttribute('disabled')).toBe('true');
		});
		it('is enabled when all fields are valid', function() {
			var username = element(by.model('newUser.username'));
			var email = element(by.model('newUser.email'));
			var password = element(by.model('newUser.password'));
			var repeatPassword = element(by.id('repeatPassword'));

			username.sendKeys('jammamamma');
			email.sendKeys('jammamamma@jammamamma');
			password.sendKeys('testtest');
			repeatPassword.sendKeys('testtest');
			expect(submit.getAttribute('disabled')).toBe('false');
			var submit = element(by.id('submit'));
		});
		describe('when clicked', function() {
			it('routes to /signup/success if the api response is 200', function() {
				expect(false).toBe(true);
			});
			it('routes to /signup/failure if the api response is anything else', function() {
				expect(false).toBe(true);
			});
		})
	});
	describe('signup.failure', function() {
		it('has an error message', function () {
			expect(false).toBe(true);
		});
		it('has a try again button that routes to signup when clicked', function () {
			expect(false).toBe(true);
		});
	});
	describe('/signup/success', function() {
		it('has a success message', function () {
			expect(false).toBe(true);
		});
		it('has a login button that routes to login when clicked', function () {
			expect(false).toBe(true);
		});
		it('has a home button that routes to root when clicked', function () {
			expect(false).toBe(true);
		});
	});
});