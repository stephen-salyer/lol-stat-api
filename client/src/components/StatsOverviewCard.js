// client/src/components/StatsOverviewCard.js
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

function StatsOverviewCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ 
              bgcolor: `${color}.main`, 
              width: 40, 
              height: 40,
              mr: 2
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h6">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsOverviewCard;