"use client";

import {
    Search,
    Flag,
    Coins,
    Info,
    ArrowRight,
    Disc as Discord,
    Twitter,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { web3auth } from "@/lib/web3auth";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import Image from "next/image";
import logo from "./images/logo.png";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const router = useRouter();
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onCaptchaChange = (value: string | null) => {
        setCaptchaValue(value);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate no results for demo
        setShowLinkedIn(true);
    };

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();

                if (web3auth.connected) {
                    setLoading(true);
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        if (!captchaValue) {
            alert("Please complete the CAPTCHA");
            return;
        }

        setLoading(true);
        try {
            await web3auth.connect();
            if (web3auth.connected) {
                router.push("/dashboard");
            }
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
                    <div className="flex items-center gap-2 ml-4 font-semibold">
                    <Image alt="" src={logo} width={55} height={55} />
                    </div>

                    <nav className="hidden md:flex flex-1 justify-end items-center gap-4 md:gap-6">
                        {loading ? (
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        ) : (
                            <Button
                                onClick={login}
                                size="default"
                                className=" px-8"
                            >
                                Login / Sign Up
                            </Button>
                        )}
                    </nav>
                </div>
            </header>
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1
                        id="sign-up"
                        className="text-4xl md:text-6xl font-bold tracking-tight"
                    >
                        We've all worked with (or for) someone awful.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground">
                    Find out who’s been flagged, or flag them yourself. Make sure the world knows.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        {loading ? (
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        ) : (
                            <Button
                                onClick={login}
                                size="lg"
                                className="text-lg px-8"
                            >
                                Sign Up Now <ArrowRight className="ml-2" />
                            </Button>
                        )}
                        <Link
                            href="#how-it-works"
                            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-lg font-medium transition"
                        >
                            Learn How It Works
                        </Link>
                    </div>
                    <div className="flex justify-center w-full">
                        {/* @ts-ignore */}
                        <ReCAPTCHA
                            sitekey="6Let1tIqAAAAAAK8XujHEbguVtjwvEjbnCBIN7DR"
                            onChange={onCaptchaChange}
                        />
                    </div>
                </div>
            </section>

            {/* Search & Flagging Section */}
            <section className="max-w-3xl mx-auto px-6 py-12 bg-white shadow-md rounded-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-4 mt-1 sm:mt-0 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search flagged people or companies..."
                            className="pl-12 h-14 border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Flagging Box */}
                    <div className="space-y-4 animate-in fade-in-50">
                        <Input
                            type="url"
                            placeholder="Paste LinkedIn profile URL to flag them"
                            className="h-12 border border-gray-300 focus:ring-2 focus:ring-red-500 rounded-lg transition-all"
                        />
                        <Button
                            type="button"
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                        >
                            🚩 Flag Them
                        </Button>
                    </div>
                </div>
            </section>

            {/* Red Flag Coins Explanation */}
            <section className="bg-muted/50 py-12 px-4">
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <Card className="p-6 bg-background/50 backdrop-blur">
                        <div className="flex items-center justify-center gap-2 text-lg mb-4">
                            <Coins className="h-6 w-6 text-destructive" />
                            <p id="how-it-works">
                                Each flag costs Red Flag Coins to ensure real,
                                not spam flags.
                            </p>
                        </div>
                        {/* <Button variant="link" className="text-destructive">
                            Learn how that all works
                        </Button> */}
                    </Card>

                    {/* How It Works */}
                    <div className="space-y-6" id="how-it-works">
                        <h2 className="text-3xl font-bold">
                            How Red Flag Works
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="p-6">
                                <Flag className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">
                                    Flag Bad Actors
                                </h3>
                                <p className="text-muted-foreground">
                                    Report individuals and companies who have
                                    wronged you
                                </p>
                            </Card>
                            <Card className="p-6">
                                <Coins className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">
                                    Earn Coins
                                </h3>
                                <p className="text-muted-foreground">
                                    Get rewarded with Red Flag Coins for
                                    valuable contributions
                                </p>
                            </Card>
                            <Card className="p-6">
                                <Info className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">
                                    Stay Informed
                                </h3>
                                <p className="text-muted-foreground">
                                    Access verified information about potential
                                    partners or employers
                                </p>
                            </Card>
                        </div>
                        {/* <Button size="lg" className="mt-8">
                            See How Red Flag Coins Work
                        </Button> */}
                    </div>
                </div>
            </section>

            {/* Sign Up CTA */}
            <section className="py-20 px-4 text-center bg-destructive text-destructive-foreground">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Ready to make a difference?
                    </h2>
                    <p className="text-xl opacity-90">
                        Join our community and help create transparency.
                    </p>
                    <Link
                        href="#sign-up"
                        className="inline-flex items-center justify-center rounded-md text-lg px-8 py-3 font-medium transition bg-white text-destructive hover:bg-white/90"
                    >
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-6 py-4 text-center text-sm">
                <div className="space-x-4">
                    <a href="/terms" className="text-muted-foreground hover:underline">
                        Terms & Conditions
                    </a>
                    <a href="/privacy" className="text-muted-foreground hover:underline">
                        Privacy Policy
                    </a>
                    <a href="/contact" className="text-muted-foreground hover:underline">
                        Contact Us
                    </a>
                    <a href="/how-tokens-work" className="text-muted-foreground hover:underline">
                        How Tokens Work
                    </a>
                </div>
            </footer>
        </div>
    );
}
