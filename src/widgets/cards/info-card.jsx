import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";



export function InfoCard({ icon: Icon, title, date, children })  {
  return (
    <div className="group border p-1 rounded-lg cursor-pointer -mb-6 hover:bg-gray-200 hover:text-gray" onClick={() => handleButtonClick(1)}>
    <Card  >
      <CardHeader
        className="flex items-center justify-between rounded-none overflow-visible "
        floated={false}
        shadow={false}
      >
        <div className="flex flex-col gap-1 w-full">
          <Typography color="blue" className="font-bold text-xs">
            {date}
          </Typography>
          <Typography color="blue-gray" variant="h5" className="w-full">
            {title}
          </Typography>
        </div>
        <IconButton
          className="flex-shrink-0 pointer-events-none"
          ripple={false}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
      </CardHeader>
   
      <CardBody className="grid justify-start !px-3.5 pt-2">
        <Typography className=" font-normal !text-gray-500">
          {children}
        </Typography>
      </CardBody>
  
    </Card>
    </div>
  );
}

export default InfoCard;
