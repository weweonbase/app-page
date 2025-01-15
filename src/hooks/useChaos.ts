import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "~/constants/configs";

export const useGetChaosList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chaos-leaderboard"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/chaos/leaderboard`);
      
      if (!response.data) {
        throw new Error("No data returned from Chaos leaderboard API.");
      }
      const data = await response.data.chaosLeaderboard
    
      return data;
    },
  });
  return { data, isLoading, error };
};

export const useGetChaosUserInfo = (address:string) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["chaos-user-info", address],
      queryFn: async () => {
        const response = await axios.get(`${API_BASE_URL}/chaos/info/${address}`);
        
        if (!response.data) {
          throw new Error("No data returned from Chaos leaderboard API.");
        }
        const data = await response.data;

        return data;
      },
    });
    return { data, isLoading, error };
  };
  