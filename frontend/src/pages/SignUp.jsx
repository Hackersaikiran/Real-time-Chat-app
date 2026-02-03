import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		// Signup ---
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then(err => Promise.reject(err));
				}
				return response.json();
			})
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				console.log("Signup Response:", json);
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message || "Registration Successful");
				} else {
					toast.error(json?.message || "Signup failed");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				const errorMsg = error?.message || error?.code || "Network error";
				toast.error("Error: " + errorMsg);
			});
	};
	const handleSignup = (e) => {
		if (firstName && lastName && email && password) {
			const validError = checkValidSignUpFrom(
				firstName,
				lastName,
				email,
				password
			);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="animated-bg-dark min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Floating background elements */}
			<div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
			<div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

			<div className="glass-effect p-8 rounded-2xl backdrop-blur-md w-full sm:w-[90%] md:w-[60%] lg:w-[45%] max-w-[500px] shadow-2xl border border-blue-400/30 animate-slideUp" style={{animation: 'slideUp 0.6s ease-out'}}>
				<div className="text-center mb-8">
					<h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
						✨ Sign Up
					</h2>
					<p className="text-blue-200 text-sm">Join our amazing chat community</p>
				</div>

				<form className="w-full flex flex-col gap-4">
					<div>
						<label className="text-blue-300 font-semibold text-sm block mb-2">
							👤 First Name
						</label>
						<input
							className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all"
							type="text"
							placeholder="Enter your first name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-blue-300 font-semibold text-sm block mb-2">
							👤 Last Name
						</label>
						<input
							className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all"
							type="text"
							placeholder="Enter your last name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-blue-300 font-semibold text-sm block mb-2">
							📧 Email Address
						</label>
						<input
							className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-blue-300 font-semibold text-sm block mb-2">
							🔒 Password
						</label>
						<div className="relative">
							<input
								className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all pr-10"
								type={isShow ? "text" : "password"}
								placeholder="Enter password (min 8 chars)"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								onClick={() => setIsShow(!isShow)}
								className="absolute right-3 top-3 text-blue-300 hover:text-blue-100 transition-colors"
							>
								{isShow ? <PiEyeClosedLight size={20} /> : <PiEye size={20} />}
							</button>
						</div>
					</div>

					<button
						type="button"
						onClick={handleSignup}
						className="w-full mt-6 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{load || "Create Account"}
					</button>

					<div className="flex items-center gap-2 text-blue-300 text-sm mt-4">
						<span>Already have an account?</span>
						<Link
							to="/signin"
							className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text hover:underline transition-all"
						>
							Sign In Here
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
						type="text"
						placeholder="Enter Last Name"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Email Address
					</h3>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="w-full border border-slate-700 my-3 py-4 px-8 rounded-full flex justify-between bg-white text-black "
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-black/80 absolute right-5 top-8"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-black rounded-full px-5 py-4 mt-5 text-lg border border-slate-400  text-slate-400 hover:text-white bg-slate-700 transition-all"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] bg-slate-600"></div>
						<Link to="/signin">
							<div className="p-3 font-semibold text-md hover:text-white">
								SignIn
							</div>
						</Link>
						<div className="w-full h-[1px] bg-slate-600"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
