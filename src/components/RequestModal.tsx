import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Props {
    open: boolean;
    onClose: () => void;
    toUserId: string;
    skillsToLearn: string[];
}

const RequestModal = ({ open, onClose, toUserId, skillsToLearn }: Props) => {
    const [skillName, setSkillName] = useState("");
    const [offerSkill, setOfferSkill] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    if (!open) return null;

    const sendRequest = async () => {
        if (!offerSkill) {
            alert("Please select a skill you can offer");
            return;
        }
        try {
            setLoading(true);

            console.log({
                receiver: toUserId,
                skill: skillName,
                note: message,
                offeredSkill: offerSkill
            });
            await api.post("/requests", {
                receiver: toUserId,
                skill: skillName,
                note: `I Teach: ${offerSkill} | Note: ${message}`,
            });
            toast({
                title: "Request sent successfully!",
            });  onClose();
} catch (e) {
  console.error(e);
} finally {
  setLoading(false);
}
};

        return ( <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"> <div className="glass rounded-2xl p-6 w-full max-w-md space-y-4">


            <h2 className="text-lg font-semibold">Send Skill Swap Request</h2>

            <div>
                <label className="text-sm text-muted-foreground">
                    Skill you want to learn
                </label>
                <select
                    className="mt-1.5 rounded-xl w-full border p-2 bg-background text-foreground"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                >
                    <option value="">Select skill you want to learn</option>
                    {skillsToLearn.map((skill) => (
                        <option key={skill} value={skill}>
                            {skill}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm text-muted-foreground">
                    Skill you can offer
                    <select
                        className="mt-1.5 rounded-xl w-full border p-2 bg-background text-foreground"
                        value={offerSkill}
                        onChange={(e) => setOfferSkill(e.target.value)}
                    >
                        <option value="">Select a skill you can offer</option>
                        {user?.skillsOffered?.map((skill: string) => (
                            <option key={skill} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label className="text-sm text-muted-foreground">Message</label>
                <Textarea
                    placeholder="Explain what you want to learn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <div className="flex gap-3">
                <Button onClick={sendRequest} disabled={loading} className="flex-1">
                    {loading ? "Sending..." : "Send Request"}
                </Button>

                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
            </div>

        </div>
        </div>
);
};

export default RequestModal;
