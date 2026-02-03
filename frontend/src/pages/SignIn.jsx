import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const logInUser = (e) => {
		// SignIn ---
		toast.loading("Wait until you SignIn");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
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
				console.log("SignIn Response:", json);
				if (json.token) {
					localStorage.setItem("token", json.token);
					dispatch(addAuth(json.data));
					navigate("/");
					toast.success(json?.message || "Login Successful");
				} else {
					toast.error(json?.message || "Login failed");
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
	const handleLogin = (e) => {
		if (email && password) {
			const validError = checkValidSignInFrom(email, password);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			logInUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="animated-bg-dark min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Floating background elements */}
			<div className="absolute top-10 left-10 w-40 h-40 bg-green-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
			<div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

			<div className="glass-effect p-8 rounded-2xl backdrop-blur-md w-full sm:w-[90%] md:w-[60%] lg:w-[45%] max-w-[500px] shadow-2xl border border-green-400/30 animate-slideUp" style={{animation: 'slideUp 0.6s ease-out'}}>
				<div className="text-center mb-8">
					<h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
						🔐 Sign In
					</h2>
					<p className="text-green-200 text-sm">Welcome back to your chat community</p>
				</div>

				<form className="w-full flex flex-col gap-4">
					<div>
						<label className="text-green-300 font-semibold text-sm block mb-2">
							📧 Email Address
						</label>
						<input
							className="w-full px-4 py-3 rounded-lg bg-white/10 border border-green-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-green-300 focus:bg-white/20 transition-all"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="text-green-300 font-semibold text-sm block mb-2">
							🔒 Password
						</label>
						<div className="relative">
							<input
								className="w-full px-4 py-3 rounded-lg bg-white/10 border border-green-400/50 text-white placeholder-gray-400 focus:outline-none focus:border-green-300 focus:bg-white/20 transition-all pr-10"
								type={isShow ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								onClick={() => setIsShow(!isShow)}
								className="absolute right-3 top-3 text-green-300 hover:text-green-100"
							>
								{isShow ? (
									<PiEyeClosedLight fontSize={20} />
								) : (
									<PiEye fontSize={20} />
								)}
							</button>
						</div>
					</div>

					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							handleLogin(e);
						}}
						className="w-full mt-6 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{load === "" ? "Sign In" : load}
					</button>

					<div className="flex items-center gap-2 text-green-300 text-sm mt-4">
						<span>Don't have an account?</span>
						<Link
							to="/signup"
							className="font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text hover:underline transition-all"
						>
							Sign Up Here
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
