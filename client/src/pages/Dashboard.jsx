import { useEffect, useState } from "react";
import { Sparkles, Gem, Loader2 } from "lucide-react";
import CreationItem from "../components/CreationItem";
import { getUserCreations } from "../api";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await getUserCreations(token);

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6 bg-gray-50">
      {/* Stats Cards */}
      <div className="flex gap-4 flex-wrap mb-8">
        {/* Total Creations */}
        <div className="flex items-center justify-between w-72 p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Total Creations</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {loading ? "..." : creations.length}
            </h2>
          </div>
          <div className="p-2 rounded-xl bg-blue-500 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex items-center justify-between w-72 p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Active Plan</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              Premium
            </h2>
          </div>

          <div className="p-2 rounded-xl bg-linear-to-br from-pink-400 via-fuchsia-500 to-purple-600 shadow-sm ring-2 ring-white/60">
            <Gem className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          Recent Creations
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : creations.length === 0 ? (
          <p className="text-gray-500">No creations yet</p>
        ) : (
          <div className="space-y-3">
            {creations.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;