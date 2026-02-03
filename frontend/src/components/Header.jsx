import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};
	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	// Scroll to top of page && Redirect Auth change --------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	// headerMenuBox outside click handler
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	// add && remove events according to isHeaderMenu
	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);
	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 shadow-lg flex justify-between items-center p-4 font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white border-b border-blue-400/30 backdrop-blur-sm"
		>
			<div className="flex items-center justify-start gap-3">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-tr-full rounded-tl-full rounded-br-full hover:shadow-lg hover:shadow-blue-400/50 transition-all"
					/>
				</Link>
				<Link to={"/"}>
					<span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-all">ChatApp</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center gap-2">
					<span
						className={`whitespace-nowrap ml-2 flex items-center justify-center relative mr-1.5 cursor-pointer hover:text-blue-300 transition-all ${
							newMessageRecieved.length > 0
								? "animate-bounce"
								: "animate-none"
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={25} />
						{newMessageRecieved.length > 0 && (
							<span className="font-semibold text-xs absolute top-0 right-0 translate-x-1.5 -translate-y-1.5 bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 rounded-full">
								{newMessageRecieved.length}
							</span>
						)}
					</span>
					<span className="whitespace-nowrap ml-2 text-blue-200">
						Hi, {user.firstName}
					</span>
					<div
						ref={headerUserBox}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setHeaderMenu(!isHeaderMenu));
						}}
						className="flex flex-nowrap transition-all items-center ml-3 border border-blue-400/50 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 shadow-lg cursor-pointer px-2 py-1"
					>
						<img
							src={user.image}
							alt="profile"
							className="w-10 h-10 rounded-full border border-blue-400/50 shadow-md"
						/>
						<span className="m-2 text-blue-300">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="border border-blue-400/50 text-white w-48 py-2 flex flex-col justify-center rounded-xl items-center gap-2 absolute top-16 right-4 z-40 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-md shadow-xl"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-blue-500/30 hover:text-blue-200 p-3 transition-all rounded-lg m-1"
							>
								<div className="flex items-center justify-center gap-3 w-full">
									<PiUserCircleLight fontSize={23} />
									<span className="font-semibold">Profile</span>
								</div>
							</div>
							<div
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-red-500/30 hover:text-red-200 p-3 transition-all rounded-lg m-1"
								onClick={handleLogout}
							>
								<div className="flex items-center justify-center gap-3 w-full">
									<IoLogOutOutline fontSize={21} />
									<span className="font-semibold">Logout</span>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-6 border border-blue-400/50 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/50 hover:to-cyan-500/50 text-blue-200 font-semibold shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105">
						Sign In
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
