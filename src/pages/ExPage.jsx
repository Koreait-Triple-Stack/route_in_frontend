import React from "react";

function ExPage() {
    const {
      data: response,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["getPrincipal"],
      queryFn: () => getPrincipal(),
      staleTime: 30000,
    });

    if (isLoading) return <div>로딩중</div>;
    if (error) return <div>error.message</div>;

    console.log(response);
    
  return <div>ExPage</div>;
}

export default ExPage;
