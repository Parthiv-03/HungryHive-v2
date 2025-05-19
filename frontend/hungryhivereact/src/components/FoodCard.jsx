import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

export default function FoodCard() {
  return (
    <Card variant="outlined" sx={{ height: 320, width: 330, borderRadius: '15px' }}>
      <CardOverflow>
        <AspectRatio ratio="1.7">
          <img
            src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
            srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md" sx={{ fontSize: '1.3rem' }}>Classic Pizza</Typography>
        <Typography level="body-sm">Vaniyavad, Nadiad</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            ₹1.000
          </Typography>
          <Divider orientation="vertical" />
          {/* <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            1 hour ago
          </Typography> */}
        </CardContent>
      </CardOverflow>
    </Card>
  );
}



// import * as React from 'react';
// import AspectRatio from '@mui/joy/AspectRatio';
// import Card from '@mui/joy/Card';
// import CardContent from '@mui/joy/CardContent';
// import CardOverflow from '@mui/joy/CardOverflow';
// import Divider from '@mui/joy/Divider';
// import Typography from '@mui/joy/Typography';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';

// export default function FoodCard({ image, title, address, price }) {
//   return (
//     <Card variant="outlined" sx={{ height: 320, width: 330, borderRadius: '15px' }}>
//       <CardOverflow>
//         <AspectRatio ratio="1.7">
//           <img
//             src={image}
//             loading="lazy"
//             alt={title}
//           />
//         </AspectRatio>
//       </CardOverflow>
//       <CardContent>
//         <Typography level="title-md" sx={{ fontSize: '1.3rem' }}>{title}</Typography>
//         <Typography level="body-sm">{address}</Typography>
//       </CardContent>
//       <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
//         <Divider inset="context" />
//         <CardContent orientation="horizontal">
//           <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
//             <Typography
//               level="body-xs"
//               textColor="text.secondary"
//               sx={{ fontWeight: 'md' }}
//             >
//               ₹{price}
//             </Typography>
//             <Button variant="contained" size="small" sx={{ ml: 2 }}>
//               Add to Cart
//             </Button>
//           </Box>
//         </CardContent>
//       </CardOverflow>
//     </Card>
//   );
// }
