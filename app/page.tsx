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
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1
                        id="sign-up"
                        className="text-4xl md:text-6xl font-bold tracking-tight"
                    >
                        Expose bad bosses, liars, and frauds.{" "}
                        <span className="text-destructive">See the truth</span>
                        —or make sure the world knows.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground">
                        Find out who's been flagged, or flag them yourself. No
                        more getting screwed over.
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

            {/* Search Section */}
            <section className="max-w-3xl mx-auto px-4 py-12">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search for flagged people or companies"
                            className="pl-12 h-14 text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {showLinkedIn && (
                        <div className="space-y-4 animate-in fade-in-50">
                            <p className="text-center text-muted-foreground">
                                ❌ No results found. Want to flag someone?
                            </p>
                            <div className="flex gap-4">
                                <Input
                                    type="url"
                                    placeholder="Paste LinkedIn profile URL to flag them"
                                    className="h-12"
                                />
                                <Button
                                    type="button"
                                    className="whitespace-nowrap"
                                >
                                    Flag Them
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
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
            <footer className="bg-background border-t">
                <div className="max-w-7xl mx-auto py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Button variant="link">About</Button>
                                </li>
                                <li>
                                    <Button variant="link">
                                        Terms & Conditions
                                    </Button>
                                </li>
                                <li>
                                    <Button variant="link">
                                        Privacy Policy
                                    </Button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Button variant="link">FAQ</Button>
                                </li>
                                <li>
                                    <Button variant="link">Contact Us</Button>
                                </li>
                                <li>
                                    <Button variant="link">Support</Button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Social</h3>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon">
                                    <Discord className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Twitter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
