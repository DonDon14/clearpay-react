import UserCard from "../../components/UserCard";

const TestCard = () => {
  return (
    <div className="p-6">
      <UserCard
        name="Jane Doe"
        email="jane@example.com"
        role="Member"
        profile_picture="https://i.pravatar.cc/150?img=10"
      />
    </div>
  );
};

export default TestCard;
